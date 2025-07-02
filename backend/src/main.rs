use std::thread;
use std::time::Duration;

use std::fs;
use axum::http::StatusCode;
use backend::network_initializer::{parse_config, spawn_network};
use backend::server::ContentServer;
use backend::simulation_controller::SimulationController;

use axum::{
    routing::{get, post, Router},
    response::{Json, IntoResponse},
    extract::{Json as ExtractJson, State, rejection::JsonRejection},
};
use tower_http::services::ServeDir;
use serde_json::{json, Value};
use tokio::net::TcpListener;
use std::sync::{Arc, Mutex};
use backend::utils::*;

// Request structures for API endpoints
#[derive(serde::Deserialize)]
struct AddNodeRequest {
    node_name: String,
    node_type: String,
}

#[derive(serde::Deserialize)]
struct AddEdgeRequest {
    from_id: u8,
    to_id: u8,
}

// Shared state structure - wraps the simulation controller for thread-safe access
#[derive(Clone)]
struct AppState {
    simulation_controller: Arc<Mutex<SimulationController>>,
}

async fn get_topology() -> Json<Value> {
    // Try to parse the actual config file
    match parse_config("examples/config/base.toml") {
        Ok(config) => {
            let mut nodes = Vec::new();
            let mut edges = Vec::new();

            // Add drones
            for drone in &config.drone {
                nodes.push(json!({
                    "data": {
                        "id": format!("drone_{}", drone.id),
                        "label": format!("Drone {}", drone.id),
                        "type": "drone"
                    }
                }));

                // Add edges from drone to connected nodes
                for connected_id in &drone.connected_node_ids {
                    edges.push(json!({
                        "data": {
                            "id": format!("edge_{}_{}", drone.id, connected_id),
                            "source": format!("drone_{}", drone.id),
                            "target": format!("server_{}", connected_id)
                        }
                    }));
                }
            }

            // Add servers
            for server in &config.server {
                nodes.push(json!({
                    "data": {
                        "id": format!("server_{}", server.id),
                        "label": format!("Server {} ({})", server.id, server.server_type),
                        "type": "server"
                    }
                }));
            }

            // Add clients
            for client in &config.client {
                nodes.push(json!({
                    "data": {
                        "id": format!("client_{}", client.id),
                        "label": format!("Client {}", client.id),
                        "type": "client"
                    }
                }));

                // Add edges from client to connected drones
                for drone_id in &client.connected_drone_ids {
                    edges.push(json!({
                        "data": {
                            "id": format!("edge_{}_{}", client.id, drone_id),
                            "source": format!("client_{}", client.id),
                            "target": format!("drone_{}", drone_id)
                        }
                    }));
                }
            }

            Json(json!({
                "nodes": nodes,
                "edges": edges
            }))
        }
        Err(_) => {
            // Fallback sample data if config file not found
            Json(json!({
                "error": {"ERROR": "Config file not found"},
            }))
        }
    }
}

async fn get_nodes() -> Json<Value> {
    let mut nodes = Vec::new();
    
    // Get base64 images for different node types
    let drone_image = image_to_base64("assets/images/drone/drone.png")
        .unwrap_or_else(|| "data:image/png;base64,".to_string());
    let chat_client_image = image_to_base64("assets/images/client/chat-client.png")
        .unwrap_or_else(|| "data:image/png;base64,".to_string());
    let web_client_image = image_to_base64("assets/images/client/web-client.png")
        .unwrap_or_else(|| "data:image/png;base64,".to_string());
    let media_server_image = image_to_base64("assets/images/server/media-server.png")
        .unwrap_or_else(|| "data:image/png;base64,".to_string());
    let text_server_image = image_to_base64("assets/images/server/text-server.png")
        .unwrap_or_else(|| "data:image/png;base64,".to_string());
    
    // Read and parse Cargo.toml to extract drone dependencies
    match fs::read_to_string("Cargo.toml") {
        Ok(cargo_content) => {
            match cargo_content.parse::<toml::Value>() {
                Ok(cargo_toml) => {
                    if let Some(dependencies) = cargo_toml.get("dependencies").and_then(|d| d.as_table()) {
                        // Extract drone dependencies
                        nodes.push(json!({
                            "name": "Rust",
                            "type": "drone",
                            "image": drone_image
                        }));
                        println!("Rust");
                        for (dep_name, _) in dependencies {
                            if dep_name.starts_with("wg_drone_") {
                                // Convert drone name to PascalCase display name
                                let display_name = format_drone_name(dep_name);
                                println!("{}", display_name);
                                nodes.push(json!({
                                    "name": display_name,
                                    "type": "drone",
                                    "image": drone_image
                                }));
                            }
                        }
                    }
                }
                Err(e) => {
                    println!("Error parsing Cargo.toml: {}", e);
                }
            }
        }
        Err(e) => {
            println!("Error reading Cargo.toml: {}", e);
        }
    }
    
    // Add predefined clients
    nodes.push(json!({
        "name": "Chat Client",
        "type": "client",
        "image": chat_client_image
    }));
    
    nodes.push(json!({
        "name": "Web Client",
        "type": "client", 
        "image": web_client_image
    }));
    
    // Add predefined servers
    nodes.push(json!({
        "name": "Media Server",
        "type": "server",
        "image": media_server_image
    }));
    
    nodes.push(json!({
        "name": "Text Server",
        "type": "server",
        "image": text_server_image
    }));
    
    Json(json!({ "nodes": nodes }))
}

// Add a drone to the network
async fn add_drone(State(state): State<AppState>, ExtractJson(payload): ExtractJson<AddNodeRequest>) -> Json<Value> {
    println!("🚁 Adding drone: {} of type: {}", payload.node_name, payload.node_type);
    
    // Access the simulation controller
    let mut controller = state.simulation_controller.lock().unwrap();
    
    println!("📊 Before adding drone:");
    println!("  Current drones: {:?}", controller.drones.keys().collect::<Vec<_>>());
    println!("  Current servers: {:?}", controller.servers.keys().collect::<Vec<_>>());
    
    // Actually spawn the drone
    match controller.add_drone() {
        Ok(()) => {
            println!("✅ Successfully spawned drone!");
            println!("📊 After adding drone:");
            println!("  Current drones: {:?}", controller.drones.keys().collect::<Vec<_>>());
            println!("  Current servers: {:?}", controller.servers.keys().collect::<Vec<_>>());
            
            Json(json!({
                "success": true,
                "message": format!("Drone '{}' added successfully", payload.node_name),
                "node_type": payload.node_type,
                "node_name": payload.node_name,
                "total_drones": controller.drones.len(),
                "total_servers": controller.servers.len()
            }))
        }
        Err(e) => {
            println!("❌ Failed to spawn drone: {}", e);
            Json(json!({
                "success": false,
                "error": format!("Failed to spawn drone: {}", e)
            }))
        }
    }
}

async fn send_message(State(state): State<AppState>, ExtractJson(payload): ExtractJson<AddEdgeRequest>) -> Json<Value> {
    println!("Sending message: {} -> {}", payload.from_id, payload.to_id);
    // Access the simulation controller
    let mut controller = state.simulation_controller.lock().unwrap();
    match controller.send_message(payload.from_id, payload.to_id) {
        Ok(()) => {
            println!("✅ Message sent successfully!");
            Json(json!({
                "success": true,
                "message": format!("Message sent from {} to {}", payload.from_id, payload.to_id)
            }))
        }
        Err(e) => {
            println!("❌ Failed to send message: {}", e);
            Json(json!({
                "success": false,
                "error": format!("Failed to send message: {}", e)
            }))
        }
    }

}

// Add a client to the network
async fn add_client(State(state): State<AppState>, ExtractJson(payload): ExtractJson<AddNodeRequest>) -> Json<Value> {
    println!("Adding client: {} of type: {}", payload.node_name, payload.node_type);
    
    // Access the simulation controller
    let mut controller = state.simulation_controller.lock().unwrap();
    
    println!("Current drones: {:?}", controller.drones.keys().collect::<Vec<_>>());
    println!("Current servers: {:?}", controller.servers.keys().collect::<Vec<_>>());
    
    // TODO: Add actual client spawning logic here
    
    Json(json!({
        "success": true,
        "message": format!("Client '{}' added successfully", payload.node_name),
        "node_type": payload.node_type,
        "node_name": payload.node_name
    }))
}

// Add a server to the network  
async fn add_server(State(state): State<AppState>, ExtractJson(payload): ExtractJson<AddNodeRequest>) -> Json<Value> {
    println!("🖥️  Adding server: {} of type: {}", payload.node_name, payload.node_type);
    
    // Access the simulation controller
    let mut controller = state.simulation_controller.lock().unwrap();
    
    println!("📊 Before adding server:");
    println!("  Current drones: {:?}", controller.drones.keys().collect::<Vec<_>>());
    println!("  Current servers: {:?}", controller.servers.keys().collect::<Vec<_>>());
    
    
    // Actually spawn the server
    match controller.add_server(ServerType::Media) {
        Ok(()) => {
            println!("📊 After adding server:");
            println!("  Current servers: {:?}", controller.s_handles);
            
            Json(json!({
                "success": true,
                "message": format!("Server '{}' added successfully", payload.node_name),
                "node_type": payload.node_type,
                "node_name": payload.node_name,
                "total_drones": controller.drones.len(),
                "total_servers": controller.servers.len()
            }))
        }
        Err(e) => {
            println!("❌ Failed to spawn server: {}", e);
            Json(json!({
                "success": false,
                "error": format!("Failed to spawn server: {}", e)
            }))
        }
    }
}

// Add an edge between two nodes
async fn add_edge(State(state): State<AppState>, ExtractJson(payload): ExtractJson<AddEdgeRequest>) -> Json<Value> {
    println!("🔗 Adding edge: {} -> {}", payload.from_id, payload.to_id);
    
    // Access the simulation controller
    let mut controller = state.simulation_controller.lock().unwrap();
    
    println!("📊 Current network state:");
    println!("  Drones: {:?}", controller.drones.keys().collect::<Vec<_>>());
    println!("  Servers: {:?}", controller.servers.keys().collect::<Vec<_>>());
    
    // Check if both nodes exist
    let from_exists = controller.drones.contains_key(&payload.from_id) || controller.servers.contains_key(&payload.from_id);
    let to_exists = controller.drones.contains_key(&payload.to_id) || controller.servers.contains_key(&payload.to_id);
    
    if !from_exists {
        println!("❌ Source node {} does not exist", payload.from_id);
        return Json(json!({
            "success": false,
            "error": format!("Source node {} does not exist", payload.from_id)
        }));
    }
    
    if !to_exists {
        println!("❌ Target node {} does not exist", payload.to_id);
        return Json(json!({
            "success": false,
            "error": format!("Target node {} does not exist", payload.to_id)
        }));
    }
    
    // Actually add the edge
    match controller.add_edge(payload.from_id, payload.to_id) {
        Ok(()) => {
            println!("✅ Successfully added edge {} -> {}!", payload.from_id, payload.to_id);
            Json(json!({
                "success": true,
                "message": format!("Edge {} -> {} added successfully", payload.from_id, payload.to_id),
                "from_id": payload.from_id,
                "to_id": payload.to_id
            }))
        }
        Err(e) => {
            println!("❌ Failed to add edge: {}", e);
            Json(json!({
                "success": false,
                "error": format!("Failed to add edge: {}", e)
            }))
        }
    }
}

// async fn add_node(
//     State(state): State<AppState>, 
//     payload: Result<Json<NodeType>, JsonRejection>
// ) -> impl IntoResponse {
//     let node_type = match payload {
//         Ok(Json(node_type)) => node_type,
//         Err(err) => {
//             return (
//                 StatusCode::BAD_REQUEST,
//                 format!("Invalid JSON: {}", err),
//             );
//         }
//     };

//     let mut controller = state.simulation_controller.lock().unwrap();

//     match node_type {
//         NodeType::Drone(drone_type) => match controller.add_drone() {
//             Ok(()) => (
//                 StatusCode::CREATED,
//                 format!("Drone of type '{:?}' created", drone_type),
//             ),
//             Err(e) => (
//                 StatusCode::INTERNAL_SERVER_ERROR,
//                 format!("Failed to create drone: {}", e),
//             ),
//         },

//         NodeType::Server(server_type) => match controller.add_server(&server_type) {
//             Ok(()) => (
//                 StatusCode::CREATED,
//                 format!("Server of type '{:?}' created", server_type),
//             ),
//             Err(e) => (
//                 StatusCode::INTERNAL_SERVER_ERROR,
//                 format!("Failed to create server: {}", e),
//             ),
//         },

//         NodeType::Client(client_type) => (
//             StatusCode::OK,
//             format!(
//                 "Client of type '{:?}' registered (spawning not implemented)",
//                 client_type
//             ),
//         ),
//     }
// }

// Simple message sending endpoint
// async fn send_message(State(state): State<AppState>) -> Json<Value> {
//     println!("📨 Send message endpoint called");
    
//     // For now, just return a placeholder response
//     Json(json!({
//         "success": true,
//         "message": "Message sending endpoint - implementation pending"
//     }))
// }

#[tokio::main]
async fn main() -> anyhow::Result<()>{
    env_logger::init();

    let config = parse_config("examples/config/base.toml")?;

    let (controller_drones, controller_server, d_handles, s_handles, node_event_send, node_event_recv, packet_channels) =
        spawn_network(config)?;

    // Create the simulation controller with all network state
    let mut simulation_controller = SimulationController {
        drones: controller_drones,
        servers: controller_server,
        drone_event_send: node_event_send,
        drone_event_recv: node_event_recv,
        d_handles,
        s_handles,
        packet_channels,
    };

    let app_state = AppState {
        simulation_controller: Arc::new(Mutex::new(simulation_controller)),
    };
    
    let app = Router::new()
        .route("/api/topology", get(get_topology))
        .route("/api/nodes", get(get_nodes))
        .route("/api/drones", post(add_drone))
        .route("/api/servers", post(add_server))
        .route("/api/edges", post(add_edge))
        .route("/api/messages", post(send_message))
        .with_state(app_state)
        .fallback_service(ServeDir::new("./dist").append_index_html_on_directories(true));

    let listener = TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("Server running on http://0.0.0.0:3000");
    axum::serve(listener, app).await.unwrap();
    Ok(())
}