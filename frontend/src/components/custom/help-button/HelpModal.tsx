import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
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
          <DialogTitle className="text-3xl font-bold flex items-center gap-2">
            <span>🚁</span>
            A Rust project about drones, clients and servers
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-base leading-relaxed">
          {/* Welcome */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-primary">👋 Welcome</h3>
            <p className="text-muted-foreground">
            This is my team project developed for the <strong>Advanced Programming</strong> course at the <strong>University of Trento</strong> during the <strong>2024/2025</strong> academic year.
            </p>
          </section>

          {/* Project Overview */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-primary">🎯 Project Overview</h3>
            <p className="text-muted-foreground mb-4">
              In simple terms, this is a simulation of how the <strong>internet</strong> works, but instead of <strong>routers</strong>, 
              we have <strong>drones</strong> that can <strong>crash</strong> or <strong>lose packets</strong>, just like real drones!<br/><strong>Clients</strong> can communicate 
              with <strong>servers</strong> to write and save <strong>files</strong>, communicate with other <strong>clients</strong> by creating <strong>chats</strong> and 
              sending <strong>messages</strong> (check out the showcase section below for a full tour of features).
            </p>
          </section>

          {/* Showcase */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-primary">❓ Showcase - How to Use</h3>
            <div>
              <div className="p-2">
                <h4 className="font-medium mb-2 text-lg">🏁 Getting Started</h4>
                <p className="text-muted-foreground">
                  Initially, a <strong>basic configuration</strong> is loaded. You can apply other <strong>configurations</strong> by clicking 
                  the <strong>gear wheel</strong> (⚙️) at the bottom left.
                </p>
              </div>
              <div className="p-2">
                <h4 className="font-medium mb-2 text-lg">⊕ Adding Nodes & Connections</h4>
                <p className="text-muted-foreground mb-3">
                  Using the ⊕ button in the toolbar, you can add <strong>nodes</strong> or <strong>connections</strong> between nodes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li><strong>Drones:</strong> <strong>11</strong> total - <strong>"Rust"</strong> (our team's drone) + <strong>10</strong> from <strong>other teams</strong></li>
                  <li><strong>Clients:</strong>
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                      <li className="list-[square]"><strong>Chat Clients:</strong> Can only communicate with <strong>Communication Servers</strong> to create, delete, join <strong>chats</strong>, or send <strong>messages</strong>. This allows chat clients to message each other!</li>
                      <li className="list-[square]"><strong>Web Clients:</strong> Can only communicate with <strong>Content Servers</strong> to write and save <strong>files</strong></li>
                    </ul>
                  </li>
                  <li><strong>Servers:</strong>
                    <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                      <li className="list-[square]"><strong>Communication Servers:</strong> Handle <strong>chat creation, deletion, joining, and messaging</strong> from Chat Clients</li>
                      <li className="list-[square]"><strong>Content Servers:</strong> Handle <strong>file writing and reading</strong> from Web Clients</li>
                    </ul>
                  </li>
                  <li><strong>Connections:</strong> Link clients to drones, servers to drones, or drones to each other</li>
                </ul>
              </div>
              <div className="p-2">
                <h4 className="font-medium mb-2 text-lg">🔍 Node Management</h4>
                <p className="text-muted-foreground mb-2">
                Click any node to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>View <strong>connected nodes</strong> (and optionally remove connections)</li>
                  <li><strong>Delete the node</strong> itself</li>
                  <li>For <strong>drones:</strong> Set <strong>PDR (Packet Drop Rate)</strong> and view <strong>packet statistics</strong></li>
                </ul>
              </div>

              <div className="p-2">
                <h4 className="font-medium mb-2 text-lg">📊 Monitoring</h4>
                <p className="text-muted-foreground">
                  Click the <strong>logs button</strong> (📄) at the bottom right to view <strong>real-time logs</strong> showing <strong>packet paths</strong>, <strong>exchanged messages</strong>, and <strong>system events</strong> (powered by <strong>Rust's log library</strong>).
                </p>
              </div>

              <div className="p-2">
                <h4 className="font-medium mb-2 text-lg">📌 Select Mode</h4>
                <p className="text-muted-foreground">
                  Switch to <strong>Select Mode</strong> (<strong>cursor icon</strong>) to <strong>pan, zoom, and inspect</strong> nodes without 
                  accidentally <strong>adding</strong> elements.
                </p>
              </div>
            </div>
          </section>

          {/* Technologies */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-primary">🛠️ Technologies Used</h3>
            <div className="grid md:grid-cols-2 gap-4 ml-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2 text-lg">
                  <span className="text-2xl">🦀</span>
                  Backend
                </h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Rust - Main project language</li>
                  <li>Axum web framework</li>
                  <li>Tokio async runtime</li>
                  <li>Crossbeam channels</li>
                  <li>RESTful API endpoints</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2 text-lg">
                  <span className="text-2xl">⚛️</span>
                  Frontend
                </h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>React + TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>Cytoscape.js</li>
                </ul>
              </div>
            </div>
          </section>

          {/* More details */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-primary">📄 Want to learn more?</h3>
            <p className="text-muted-foreground mb-4">
              If you're curious about how communication between nodes works, how each node becomes aware of the network topology, or other technical aspects of the simulation, feel free to check out the full project specifications{" "}
              <a 
                href="https://github.com/LuigiMiazzo17/unitn-advancedProgramming-WGL_2024-rust/tree/master/README.md" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                here
              </a>.
            </p>
          </section>

          {/* Some curiosities about the project */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-primary">💡 Some curiosities about the project</h3>
            <p className="text-muted-foreground mb-2">
                This project was developed as part of a unique <strong>W3C-like Working Group experience</strong>. Students were divided into teams, each electing a <strong>Working Group Leader (WGL)</strong> to represent them in weekly collaborative meetings, where shared decisions and protocol changes were discussed.<br />One student was elected as the <strong>Working Group Coordinator (WGC)</strong>, responsible for facilitating meetings and drafting the official protocol specification (DCP).
            </p>
            <p className="text-muted-foreground mb-4">
              In addition, each team participating in the course programmed their own <strong>drone</strong> with optional <strong>custom features</strong>. Towards the end of the course, there was a <strong>"fair"</strong> where each team 
                had to both <strong>buy 10 drones</strong> from others and <strong>sell their own</strong> to as many teams as possible, showcasing  <strong>well-tested code</strong> or distributing custom <strong>food/gadgets</strong> (that always works!).<br/>
                The <strong>top 3 selling teams</strong> received <strong>bonus points</strong> for the final exam.
            </p>
          </section>

          {/* Supported Drones Types */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-primary">🛸 Supported Drones</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <a 
                href="https://github.com/LuigiMiazzo17/unitn-advancedProgramming-WGL_2024-drone" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
              >
                Rust
              </a>
              <a 
                href="https://github.com/rusty-drone-2024/rusty-drone" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-50 dark:bg-green-900/20 p-3 rounded text-center hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors cursor-pointer"
              >
                Rusty Drones
              </a>
              <a 
                href="https://github.com/daw-dev/bagel-bomber" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded text-center hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer"
              >
                Bagel Bomber
              </a>
              <a 
                href="https://github.com/Seregno/Public_Bry_w_locie" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded text-center hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors cursor-pointer"
              >
                Bobry w Locie
              </a>
              <a 
                href="https://github.com/AP-2024-25-D-R-O-N-E/drone" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-center hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
              >
                D-R-O-N-E
              </a>
              <a 
                href="https://github.com/anass03/LeDron_James" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded text-center hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors cursor-pointer"
              >
                LeDron James
              </a>
              <a 
                href="https://github.com/Lockheed-Rustin/drone" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded text-center hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors cursor-pointer"
              >
                Lockheed Rustin
              </a>
              <a 
                href="https://github.com/RustDoIt/Drone" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-pink-50 dark:bg-pink-900/20 p-3 rounded text-center hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors cursor-pointer"
              >
                Rust Do It
              </a>
              <a 
                href="https://github.com/Rustbusters/drone" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded text-center hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors cursor-pointer"
              >
                Rustbusters
              </a>
              <a 
                href="https://github.com/RustRoveri/rust-roveri" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded text-center hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors cursor-pointer"
              >
                Rust Roveri
              </a>
              <a 
                href="https://github.com/Suge42/Skylink_drone" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded text-center hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors cursor-pointer"
              >
                Skylink
              </a>
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
