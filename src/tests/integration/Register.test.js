import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from '../../components/Register'; // Adjust the path to your Register component
import { BrowserRouter } from 'react-router-dom';

describe('Register Integration Tests', () => {
    test('renders the Register form', () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    test('submits the form with valid data', () => {
        const mockSubmit = jest.fn();
        render(
            <BrowserRouter>
                <Register onSubmit={mockSubmit} />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        expect(mockSubmit).toHaveBeenCalledWith({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
        });
    });

    test('shows error messages for invalid inputs', () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        expect(screen.getByText(/username is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
});