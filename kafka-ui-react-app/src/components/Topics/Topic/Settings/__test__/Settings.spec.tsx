import React from 'react';
import { render, WithRoute } from 'lib/testHelpers';
import { screen } from '@testing-library/react';
import Settings from 'components/Topics/Topic/Settings/Settings';
import { clusterTopicSettingsPath } from 'lib/paths';
import { topicConfigPayload } from 'lib/fixtures/topics';
import { useTopicConfig } from 'lib/hooks/api/topics';
import userEvent from '@testing-library/user-event';

const clusterName = 'Cluster_Name';
const topicName = 'Topic_Name';

jest.mock('lib/hooks/api/topics', () => ({
  useTopicConfig: jest.fn(),
}));

const getName = () => screen.getByText('compression.type');
const getValue = () => screen.getByText('producer');

describe('Settings', () => {
  const renderComponent = () => {
    const path = clusterTopicSettingsPath(clusterName, topicName);
    return render(
      <WithRoute path={clusterTopicSettingsPath()}>
        <Settings />
      </WithRoute>,
      { initialEntries: [path] }
    );
  };

  beforeEach(() => {
    (useTopicConfig as jest.Mock).mockImplementation(() => ({
      data: topicConfigPayload,
    }));
    renderComponent();
  });

  it('renders without CustomValue', () => {
    expect(getName()).toBeInTheDocument();
    expect(getName()).toHaveStyle('font-weight: 400');
    expect(getValue()).toBeInTheDocument();
    expect(getValue()).toHaveStyle('font-weight: 400');
  });

  it('renders search input', async () => {
    expect(
      screen.getByPlaceholderText('Search by Setting Name')
    ).toBeInTheDocument();
  });

  it('handles switch of show custom values', async () => {
    const switchInput = screen.getByLabelText('Show Only Customized Values');
    expect(switchInput).toBeInTheDocument();

    await userEvent.click(switchInput);
    expect(screen.getAllByRole('row').length).toEqual(2);
    await userEvent.click(switchInput);
    expect(screen.getAllByRole('row').length).toEqual(
      topicConfigPayload.length + 1
    );
  });

  it('filters with search value', async () => {
    const searchbox = screen.getByPlaceholderText('Search by Setting Name');
    expect(searchbox).toBeInTheDocument();
    expect(searchbox).toHaveValue('');

    await userEvent.type(searchbox, 'compres');
    expect(searchbox).toHaveValue('compres');
  });
});
