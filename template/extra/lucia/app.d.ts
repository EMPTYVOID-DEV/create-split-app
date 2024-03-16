declare global {
  namespace App {
    // interface Error {}
    // interface PageData {}
    // interface Platform {}
    interface Locals {
      user: import("lucia").User | null;
      session: import("lucia").Session | null;
    }
  }
}
