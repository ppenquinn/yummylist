import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

test("Renders the main page", () => {
  render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
  // expect(true).toBeTruthy();
  const linkElement = screen.getByText(/Yummy List/i);
  expect(linkElement).toBeInTheDocument();
});
