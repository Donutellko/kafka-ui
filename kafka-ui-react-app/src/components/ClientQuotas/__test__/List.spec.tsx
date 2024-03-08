import React from 'react';
import { render, WithRoute } from 'lib/testHelpers';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { clusterClientQuotasPath } from 'lib/paths';
import List from 'components/ClientQuotas/List';
import { useClientQuotas } from 'lib/hooks/api/clientQuotas';
import { quotaPayload } from 'lib/fixtures/quotas';

jest.mock('lib/hooks/api/clientQuotas', () => ({
  useClientQuotas: jest.fn(),
}));

describe('ClientQuotas List Component', () => {
  const clusterName = 'local';
  const renderComponent = () =>
    render(
      <WithRoute path={clusterClientQuotasPath()}>
        <List />
      </WithRoute>,
      {
        initialEntries: [clusterClientQuotasPath(clusterName)],
      }
    );

  describe('ClientQuotas List', () => {
    describe('when the quotas are loaded', () => {
      beforeEach(() => {
        (useClientQuotas as jest.Mock).mockImplementation(() => ({
          data: quotaPayload,
          isSuccess: true,
        }));
      });

      it('renders ClientQuotas List with records', async () => {
        renderComponent();
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getAllByRole('row').length).toEqual(5);
      });

      it('filters by search text', async () => {
        renderComponent();
        const searchbox = screen.getByPlaceholderText(
          'Search by User, Client or IP'
        );
        expect(searchbox).toBeInTheDocument();
        expect(searchbox).toHaveValue('');

        await userEvent.type(searchbox, 'res');
        expect(searchbox).toHaveValue('res');
      });
    });

    describe('when it has no quotas', () => {
      beforeEach(() => {
        (useClientQuotas as jest.Mock).mockImplementation(() => ({
          data: [],
          isSuccess: true,
        }));
      });

      it('renders empty list with message', async () => {
        renderComponent();
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(
          screen.getByRole('row', { name: 'No quotas found' })
        ).toBeInTheDocument();
      });
    });
  });
});
