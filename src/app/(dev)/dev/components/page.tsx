"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Modal } from "@/components/modal";

export default function ComponentsDemo() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex">
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

        <main className="flex-1 p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Components Demo</h1>
            <p className="text-muted-foreground">
              Showcase of shadcn/ui components and custom components
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button>Default Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inputs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Input placeholder="Enter text..." />
                <Input type="email" placeholder="Enter email..." />
                <Input type="password" placeholder="Enter password..." />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modal Dialog</CardTitle>
              </CardHeader>
              <CardContent>
                <Modal
                  title="Example Modal"
                  description="This demonstrates the modal component built with shadcn/ui dialog."
                  triggerText="Open Example Modal"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-12 bg-primary rounded" />
                  <p className="text-sm">Primary</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 bg-secondary rounded" />
                  <p className="text-sm">Secondary</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 bg-accent rounded" />
                  <p className="text-sm">Accent</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 bg-muted rounded" />
                  <p className="text-sm">Muted</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-card border rounded">
                  <h3 className="font-semibold">Default Card</h3>
                  <p className="text-sm text-muted-foreground">
                    Using default card background
                  </p>
                </div>
                <div className="p-4 bg-primary text-primary-foreground border rounded">
                  <h3 className="font-semibold">Primary Card</h3>
                  <p className="text-sm">Using primary color variant</p>
                </div>
                <div className="p-4 bg-secondary text-secondary-foreground border rounded">
                  <h3 className="font-semibold">Secondary Card</h3>
                  <p className="text-sm">Using secondary color variant</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
