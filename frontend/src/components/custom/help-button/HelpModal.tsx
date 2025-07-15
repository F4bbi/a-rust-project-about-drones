import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <span>🚁</span>
            Simulation Controller - Project Overview
          </DialogTitle>
          <DialogDescription>
            Advanced network simulation and drone communication system
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 text-sm leading-relaxed">
          {/* Project Overview */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary">🎯 Project Overview</h3>
            <p className="text-muted-foreground">
              This simulation controller is an advanced network management system designed to simulate 
              and control a network of autonomous drones, servers, and clients. Built with Rust for 
              the backend and React/TypeScript for the frontend, it provides real-time monitoring, 
              configuration management, and interactive network topology visualization.
            </p>
          </section>

          {/* Key Features */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary">✨ Key Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">🗺️ Network Topology</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Interactive network visualization</li>
                  <li>Real-time topology updates</li>
                  <li>Dynamic node and edge management</li>
                  <li>Multiple layout algorithms</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">🤖 Multi-Drone Support</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Multiple drone implementations</li>
                  <li>Packet Drop Rate (PDR) control</li>
                  <li>Real-time performance monitoring</li>
                  <li>Crash simulation and recovery</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">💬 Communication Systems</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Chat and web client simulation</li>
                  <li>Content and communication servers</li>
                  <li>Message routing and delivery</li>
                  <li>Public/private file management</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">📊 Monitoring & Logs</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Real-time log streaming</li>
                  <li>Filterable log levels</li>
                  <li>Performance metrics</li>
                  <li>Network statistics</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary">🚀 How to Use</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">1. Network Configuration</h4>
                <p className="text-muted-foreground">
                  Use the configuration button (⚙️) at the bottom left to load different network topologies 
                  and switch between predefined configurations.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">2. Node Management</h4>
                <p className="text-muted-foreground">
                  Click on any node to view details, modify settings, send messages, or crash nodes. 
                  Use the toolbar to add new nodes or create connections between existing ones.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">3. Real-time Monitoring</h4>
                <p className="text-muted-foreground">
                  Access logs via the logs button (📄) at the bottom right. Filter by log level 
                  (TRACE, DEBUG, INFO, WARN, ERROR) to focus on relevant information.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">4. Message Testing</h4>
                <p className="text-muted-foreground">
                  Send various types of messages between nodes including chat messages, file operations, 
                  and system commands to test network communication.
                </p>
              </div>
            </div>
          </section>

          {/* Technical Details */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary">🔧 Technical Architecture</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Backend (Rust)</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Axum web framework</li>
                  <li>Tokio async runtime</li>
                  <li>Multi-threaded simulation engine</li>
                  <li>RESTful API endpoints</li>
                  <li>Real-time log aggregation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Frontend (React/TypeScript)</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Cytoscape.js for network visualization</li>
                  <li>Tailwind CSS for styling</li>
                  <li>Lucide React icons</li>
                  <li>Responsive design</li>
                  <li>Dark/light theme support</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Supported Drone Types */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary">🛸 Supported Drone Types</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-center">Rust</div>
              <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-center">Rusty Drones</div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded text-center">Bagel Bomber</div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded text-center">Bobry w Locie</div>
              <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded text-center">D-R-O-N-E</div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded text-center">LeDron James</div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded text-center">Lockheed Rustin</div>
              <div className="bg-pink-50 dark:bg-pink-900/20 p-2 rounded text-center">Rust Do It</div>
              <div className="bg-teal-50 dark:bg-teal-900/20 p-2 rounded text-center">Rustbusters</div>
              <div className="bg-cyan-50 dark:bg-cyan-900/20 p-2 rounded text-center">Rust Roveri</div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded text-center">Skylink</div>
            </div>
          </section>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
