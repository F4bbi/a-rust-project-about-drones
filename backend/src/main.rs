use std::thread;
use std::time::Duration;
use log::{debug, error, warn};

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
    extract::Path,
};
use tower_http::services::ServeDir;
use serde_json::{json, Value};
use tokio::net::TcpListener;

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
        .fallback_service(ServeDir::new("./dist").append_index_html_on_directories(true));

    let listener = TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("Server running on http://0.0.0.0:3000");
    axum::serve(listener, app).await.unwrap();
    Ok(())
}