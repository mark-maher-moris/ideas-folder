export function Footer() {
  return (
    <footer className="border-t bg-background px-8">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">About Project Hub</h3>
            <p className="text-sm text-muted-foreground">
              A platform for collaborative project development and idea sharing.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/projects" className="text-muted-foreground hover:text-foreground">
                  Browse Projects
                </a>
              </li>
              <li>
                <a href="/ideas" className="text-muted-foreground hover:text-foreground">
                  Suggested Ideas
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/docs" className="text-muted-foreground hover:text-foreground">
                  Documentation
                </a>
              </li>
              <li>
                <a href="/guidelines" className="text-muted-foreground hover:text-foreground">
                  Guidelines
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://github.com" className="text-muted-foreground hover:text-foreground">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://discord.com" className="text-muted-foreground hover:text-foreground">
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Project Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
