import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MovieDetails from "../components/MovieDetails";
import { MemoryRouter } from "react-router-dom";

const mockUseAuth0 = jest.fn();
const mockAxiosGet = jest.fn();
const mockUseParams = jest.fn();
const movieId = "123";
const movieData = {
  title: "Test Movie",
  release_date: "2022-06-27",
  genres: [{ name: "Genre 1" }, { name: "Genre 2" }, { name: "Genre 3" }],
  runtime: 120,
  vote_average: 8.5,
  overview: "A test movie",
};

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  useAuth0: () => mockUseAuth0(),
}));

jest.mock("axios", () => ({
  get: () => mockAxiosGet(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => mockUseParams(),
}));

beforeEach(() => {
  mockUseAuth0.mockReturnValue({ isAuthenticated: false });
  mockUseParams.mockReturnValue({ id: movieId });
  mockAxiosGet.mockResolvedValue({ data: movieData });

  render(
    <MemoryRouter>
      <MovieDetails />
    </MemoryRouter>
  );
});

test("renders movie details correctly", async () => {
  await waitFor(() => expect(mockAxiosGet).toHaveBeenCalled());

  expect(screen.getByText(movieData.title)).toBeInTheDocument();
  expect(screen.getByText("2022")).toBeInTheDocument();
  expect(screen.getByText("Genre 1, Genre 2, Genre 3")).toBeInTheDocument();
  expect(screen.getByText("2h 0m")).toBeInTheDocument();
  expect(screen.getByText("8.5")).toBeInTheDocument();
  expect(screen.getByText(movieData.overview)).toBeInTheDocument();
});

test("user can input comment", () => {
  const commentInput = screen.getByPlaceholderText("Enter your comment");
  fireEvent.change(commentInput, { target: { value: "test comment" } });

  expect(commentInput.value).toBe("test comment");
});

test("submitting comment form adds new comment", () => {
  const commentInput = screen.getByPlaceholderText("Enter your comment");
  fireEvent.change(commentInput, { target: { value: "test comment" } });

  const submitButton = screen.getByText("Submit");
  fireEvent.click(submitButton);

  expect(screen.getByText("test comment")).toBeInTheDocument();
});
