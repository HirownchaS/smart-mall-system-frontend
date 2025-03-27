import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import Stores from '../components/Store/Stores';

// Mock fetch
global.fetch = jest.fn();

// Mock react-router-dom Link component
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock AOS library
jest.mock('aos', () => ({
  init: jest.fn(),
}));

describe('Stores Component', () => {
  const mockStoresData = [
    {
      _id: '1',
      name: 'Downtown Store',
      img: 'https://example.com/store1.jpg',
      storeNo: 100
    },
    {
      _id: '2', 
      name: 'Uptown Store',
      img: 'https://example.com/store2.jpg',
      storeNo: 200
    }
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders stores page header', async () => {
    // Mock successful fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStoresData)
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <Stores />
        </BrowserRouter>
      );
    });

    // Check for page header elements
    expect(screen.getByText(/Our Stores/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore Our Stores/i)).toBeInTheDocument();
  });

  test('renders store cards after fetching data', async () => {
    // Mock successful fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStoresData)
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <Stores />
        </BrowserRouter>
      );
    });

    // Wait for store cards to render
    await waitFor(() => {
      expect(screen.getByText('Downtown Store')).toBeInTheDocument();
      expect(screen.getByText('Uptown Store')).toBeInTheDocument();
    });

    // Check number of store cards
    const viewStoreButtons = screen.getAllByText('View Store');
    expect(viewStoreButtons).toHaveLength(2);
  });

  test('handles fetch error', async () => {
    // Mock fetch error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch.mockRejectedValueOnce(new Error('Fetch failed'));

    await act(async () => {
      render(
        <BrowserRouter>
          <Stores />
        </BrowserRouter>
      );
    });

    // Wait for error to be logged
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching stores:', 
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  test('renders correct number of store images', async () => {
    // Mock successful fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStoresData)
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <Stores />
        </BrowserRouter>
      );
    });

    // Wait for images to render
    await waitFor(() => {
      const storeImages = screen.getAllByRole('img');
      expect(storeImages).toHaveLength(2);
    });
  });
});