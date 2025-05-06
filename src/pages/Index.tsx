
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Lock } from "@/components/Icons";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      {/* Hero section */}
      <header className="container px-4 py-6 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xl font-bold text-primary">Quluub</span>
        </div>
        <div>
          <Link to="/auth">
            <Button variant="outline" className="mr-2">Login</Button>
          </Link>
          <Link to="/auth">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero section */}
        <section className="container px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Find your perfect match</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with people who share your values, interests, and goals
            </p>
            <Link to="/auth">
              <Button size="lg" className="rounded-full px-8">
                Get Started
              </Button>
            </Link>
          </div>
        </section>

        {/* Features section */}
        <section className="container px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Matches</h3>
              <p className="text-muted-foreground">
                Our algorithm prioritizes compatible matches based on shared values and interests.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg border text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Meaningful Conversations</h3>
              <p className="text-muted-foreground">
                Start genuine connections through our conversation-first approach.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg border text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Safe & Secure</h3>
              <p className="text-muted-foreground">
                Your privacy is our priority with verified profiles and secure messaging.
              </p>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to find your perfect match?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of people who have found meaningful relationships through Quluub
            </p>
            <Link to="/auth">
              <Button 
                size="lg" 
                variant="secondary" 
                className="rounded-full px-8"
              >
                Create Your Profile
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-xl font-bold text-primary">Quluub</span>
              <p className="text-sm text-muted-foreground mt-2">
                Find meaningful connections.
              </p>
            </div>
            <div className="flex flex-wrap gap-8">
              <div>
                <h4 className="font-medium mb-3">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-primary">Features</a></li>
                  <li><a href="#" className="hover:text-primary">Premium</a></li>
                  <li><a href="#" className="hover:text-primary">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-primary">About</a></li>
                  <li><a href="#" className="hover:text-primary">Careers</a></li>
                  <li><a href="#" className="hover:text-primary">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-primary">Privacy</a></li>
                  <li><a href="#" className="hover:text-primary">Terms</a></li>
                  <li><a href="#" className="hover:text-primary">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t mt-12 pt-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Quluub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
