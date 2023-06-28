import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../components/Header";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      results: [{
        id: 1,
      }]
    }),
  })
);

beforeEach(() => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders app name and search form', () => {
  expect(screen.getByText("CinemaLib")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Search for a movie...")).toBeInTheDocument();
});

test('search form calls navigate with correct parameters when form is submitted', async () => {
  const searchInput = screen.getByPlaceholderText("Search for a movie...");
  const searchButton = screen.getByText("Search");

  fireEvent.change(searchInput, { target: { value: 'test' } });
  fireEvent.click(searchButton);

  await new Promise(r => setTimeout(r, 100)); // pause for a moment

  expect(mockNavigate).toHaveBeenCalledWith("/movies/1");
});

test('console log when no movie is found', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({
        results: []
      }),
    })
  );
  
  const searchInput = screen.getByPlaceholderText("Search for a movie...");
  const searchButton = screen.getByText("Search");
  
  fireEvent.change(searchInput, { target: { value: 'test' } });
  fireEvent.click(searchButton);

  await new Promise(r => setTimeout(r, 100)); // pause for a moment

  expect(console.log).toHaveBeenCalledWith('No results found for "test"');
});
