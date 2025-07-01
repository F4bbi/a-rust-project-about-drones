use std::thread;
use std::time::Duration;

use backend::network::message::{Message, Request};
use backend::network::NodeCommand;
use backend::network::SimControllerMessage;
use backend::network_initializer::{parse_config, spawn_network};
use backend::simulation_controller::SimulationController;

fn old_main() -> anyhow::Result<()> {
    env_logger::init();

    let config = parse_config("examples/config/base.toml")?;

    let (controller_drones, controller_server, node_event_recv, mut d_handles, mut s_handles) =
        spawn_network(config)?;

    let mut controller = SimulationController {
        drones: controller_drones,
        node_event_recv,
    };

    thread::sleep(Duration::from_secs(1));

    // controller_server
    //     .get(&10)
    //     .unwrap()
    //     .send(NodeCommand::SendMessage((
    //         20,
    //         Message::Request(Request::WritePublicFile("file2".to_string(), "ciaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaduhapjfbewphbgerpauhorbfhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhho".to_string())),
    //     )))?;

    controller_server
        .get(&20)
        .unwrap()
        .send(NodeCommand::SendMessage(
            SimControllerMessage::SendMessageToPeer(
                10,
                Message::Request(Request::ServerType))))?;
    // controller_server
    //     .get(&10)
    //     .unwrap()
    //     .send(NodeCommand::SendMessage(
    //         SimControllerMessage::SendMessageToPeer(
    //             20,
    //             Message::Request(Request::DeleteChat(6852741936126412825)),
    //         ),
    //     ))?;

    thread::sleep(Duration::from_secs(2));

    controller.crash_all()?;

    for c in controller_server.iter() {
        c.1.send(NodeCommand::Quit)?;
    }

    while let Some(handle) = s_handles.pop() {
        let _ = handle.join();
    }

    Ok(())
}



use axum::{
    routing::{get, Router},
    response::Json,
};
use tower_http::services::ServeDir;
use serde_json::{json, Value};
use tokio::net::TcpListener;
use std::fs;
use std::path::Path;
use base64::{Engine as _, engine::general_purpose};

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
                        for (dep_name, _) in dependencies {
                            if dep_name.starts_with("wg_drone_") {
                                // Convert drone name to PascalCase display name
                                let display_name = format_drone_name(dep_name);
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

// Convert drone dependency name to display name
// e.g., "wg_drone_bobry_w_locie" -> "Bobry W Locie"
fn format_drone_name(dep_name: &str) -> String {
    if let Some(drone_part) = dep_name.strip_prefix("wg_drone_") {
        drone_part
            .split('_')
            .map(|word| {
                if word.is_empty() {
                    String::new()
                } else {
                    let mut chars = word.chars();
                    match chars.next() {
                        None => String::new(),
                        Some(first) => first.to_uppercase().collect::<String>() + &chars.as_str().to_lowercase(),
                    }
                }
            })
            .filter(|word| !word.is_empty())
            .collect::<Vec<String>>()
            .join(" ")
    } else {
        dep_name.to_string()
    }
}

// Helper function to read image file and convert to base64 data URL
fn image_to_base64(file_path: &str) -> Option<String> {
    match fs::read(file_path) {
        Ok(image_data) => {
            let base64_data = general_purpose::STANDARD.encode(&image_data);
            // Determine MIME type based on file extension
            let mime_type = if file_path.ends_with(".png") {
                "image/png"
            } else if file_path.ends_with(".jpg") || file_path.ends_with(".jpeg") {
                "image/jpeg"
            } else {
                "image/png" // default
            };
            Some(format!("data:{};base64,{}", mime_type, base64_data))
        }
        Err(e) => {
            println!("Error reading image {}: {}", file_path, e);
            None
        }
    }
}

#[tokio::main]
async fn main() -> anyhow::Result<()>{
    //env_logger::init();

    let config = parse_config("examples/config/base.toml")?;

    let (controller_drones, controller_server, node_event_recv, mut d_handles, mut s_handles) =
        spawn_network(config)?;

    let mut controller = SimulationController {
        drones: controller_drones,
        node_event_recv,
    };

    thread::sleep(Duration::from_secs(1));
    let app = Router::new()
        .route("/api/topology", get(get_topology))
        .route("/api/nodes", get(get_nodes))
        .fallback_service(ServeDir::new("./dist").append_index_html_on_directories(true));

    let listener = TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("Server running on http://0.0.0.0:3000");
    axum::serve(listener, app).await.unwrap();
    Ok(())
}