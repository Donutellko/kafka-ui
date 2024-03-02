import React from 'react';
import ElapsedTime from 'components/common/ElapsedTime/ElapsedTime';
import { render, screen } from '@testing-library/react';

describe('ElapsedTime', () => {
  it('renders days correctly', () => {
    render(<ElapsedTime value={7 * 24 * 60 * 60 * 1000} />);
    expect(screen.getByText('7d')).toBeInTheDocument();
  });
  it('renders hours correctly', () => {
    render(<ElapsedTime value={5 * 60 * 60 * 1000} />);
    expect(screen.getByText('5h')).toBeInTheDocument();
  });
  it('renders minutes correctly', () => {
    render(<ElapsedTime value={3 * 60 * 1000} />);
    expect(screen.getByText('3min')).toBeInTheDocument();
  });
  it('renders seconds correctly', () => {
    render(<ElapsedTime value={10 * 1000} />);
    expect(screen.getByText('10s')).toBeInTheDocument();
  });
  it('renders milliseconds correctly', () => {
    render(<ElapsedTime value={20} />);
    expect(screen.getByText('20ms')).toBeInTheDocument();
  });

  it('renders full name days correctly', () => {
    render(<ElapsedTime value={7 * 24 * 60 * 60 * 1000} shorthand={false} />);
    expect(screen.getByText('7 days')).toBeInTheDocument();
  });
  it('renders full name hours correctly', () => {
    render(<ElapsedTime value={5 * 60 * 60 * 1000} shorthand={false} />);
    expect(screen.getByText('5 hours')).toBeInTheDocument();
  });
  it('renders full name minutes correctly', () => {
    render(<ElapsedTime value={3 * 60 * 1000} shorthand={false} />);
    expect(screen.getByText('3 minutes')).toBeInTheDocument();
  });
  it('renders full name minutes correctly', () => {
    render(<ElapsedTime value={3 * 60 * 1000 + 20 * 1000} shorthand={false} />);
    expect(screen.getByText('3 minutes')).toBeInTheDocument();
  });
  it('renders full name seconds correctly', () => {
    render(<ElapsedTime value={10 * 1000} shorthand={false} />);
    expect(screen.getByText('10 seconds')).toBeInTheDocument();
  });
  it('renders full name milliseconds correctly', () => {
    render(<ElapsedTime value={20} shorthand={false} />);
    expect(screen.getByText('20 milliseconds')).toBeInTheDocument();
  });
  it('renders full name singular minutes correctly', () => {
    render(<ElapsedTime value={1 * 60 * 1000} shorthand={false} />);
    expect(screen.getByText('1 minute')).toBeInTheDocument();
  });
  it('renders inifinite correctly', () => {
    render(<ElapsedTime value={-1} shorthand={false} />);
    expect(screen.getByText('Infinite')).toBeInTheDocument();
  });
});
