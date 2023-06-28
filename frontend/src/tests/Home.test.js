import { render, screen } from "@testing-library/react";
import Home from "../components/Home";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

let mockIsAuthenticated = false;
let mockUser = { name: "Luyi" };
const mockLogout = jest.fn();
const mockLoginWithRedirect = jest.fn();

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  useAuth0: () => ({
    loginWithRedirect: mockLoginWithRedirect,
    logout: mockLogout,
    user: mockUser,
    isAuthenticated: mockIsAuthenticated,
  }),
}));

test("renders Login button when user is not authenticated", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Home />
    </MemoryRouter>
  );

  expect(screen.getByText("Log in")).toBeInTheDocument();
});

test("login button calls loginWithRedirect when clicked", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Home />
    </MemoryRouter>
  );

  const loginButton = screen.getByText("Log in");
  await userEvent.click(loginButton);

  expect(mockLoginWithRedirect).toHaveBeenCalled();
});

test("renders Welcome message and Log out button when user is authenticated", () => {
  mockIsAuthenticated = true;

  render(
    <MemoryRouter initialEntries={["/"]}>
      <Home />
    </MemoryRouter>
  );

  expect(screen.getByText(`Welcome, ${mockUser.name}!`)).toBeInTheDocument();
  expect(screen.getByText("Log out")).toBeInTheDocument();
});

test("logout button calls logout when clicked", async () => {
  mockIsAuthenticated = true;
  
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Home />
    </MemoryRouter>
  );

  const logoutButton = screen.getByText("Log out");
  await userEvent.click(logoutButton);

  expect(mockLogout).toHaveBeenCalled();
});
