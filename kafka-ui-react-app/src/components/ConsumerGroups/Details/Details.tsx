import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAppParams from 'lib/hooks/useAppParams';
import {
  clusterConsumerGroupResetRelativePath,
  clusterConsumerGroupsPath,
  ClusterGroupParam,
} from 'lib/paths';
import Search from 'components/common/Search/Search';
import ClusterContext from 'components/contexts/ClusterContext';
import PageHeading from 'components/common/PageHeading/PageHeading';
import * as Metrics from 'components/common/Metrics';
import { Tag } from 'components/common/Tag/Tag.styled';
import groupBy from 'lodash/groupBy';
import { Table } from 'components/common/table/Table/Table.styled';
import getTagColor from 'components/common/Tag/getTagColor';
import { Dropdown } from 'components/common/Dropdown';
import { ControlPanelWrapper } from 'components/common/ControlPanel/ControlPanel.styled';
import { Action, ConsumerGroupState, ResourceType } from 'generated-sources';
import { ActionDropdownItem } from 'components/common/ActionComponent';
import TableHeaderCell from 'components/common/table/TableHeaderCell/TableHeaderCell';
import {
  useConsumerGroupDetails,
  useDeleteConsumerGroupMutation,
} from 'lib/hooks/api/consumers';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { CONSUMER_GROUP_STATE_TOOLTIPS } from 'lib/constants';
import Switch from 'components/common/Switch/Switch';

import ListItem from './ListItem';

const Details: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get('q') || '';
  const showLagging = searchParams.get('showLagging') === 'true';
  const { isReadOnly } = React.useContext(ClusterContext);
  const routeParams = useAppParams<ClusterGroupParam>();
  const { clusterName, consumerGroupID } = routeParams;

  const consumerGroup = useConsumerGroupDetails(routeParams);
  const deleteConsumerGroup = useDeleteConsumerGroupMutation(routeParams);

  const onDelete = async () => {
    await deleteConsumerGroup.mutateAsync();
    navigate('../');
  };

  const onResetOffsets = () => {
    navigate(clusterConsumerGroupResetRelativePath);
  };

  const handleSwitch = () => {
    if (searchParams.has('showLagging')) searchParams.delete('showLagging');
    else searchParams.set('showLagging', 'true');
    setSearchParams(searchParams);
  };

  const filteredPartitionsByLag = consumerGroup.data?.partitions?.filter(
    (p) => !showLagging || (p.consumerLag && p.consumerLag > 0)
  );

  const partitionsByTopic = groupBy(filteredPartitionsByLag, 'topic');
  const currentPartitionsByTopic = Object.keys(partitionsByTopic).filter(
    (el) => !searchValue.length || el.includes(searchValue)
  );

  const hasAssignedTopics = consumerGroup?.data?.topics !== 0;

  return (
    <div>
      <div>
        <PageHeading
          text={consumerGroupID}
          backTo={clusterConsumerGroupsPath(clusterName)}
          backText="Consumers"
        >
          {!isReadOnly && (
            <Dropdown>
              <ActionDropdownItem
                onClick={onResetOffsets}
                permission={{
                  resource: ResourceType.CONSUMER,
                  action: Action.RESET_OFFSETS,
                  value: consumerGroupID,
                }}
                disabled={!hasAssignedTopics}
              >
                Reset offset
              </ActionDropdownItem>
              <ActionDropdownItem
                confirm="Are you sure you want to delete this consumer group?"
                onClick={onDelete}
                danger
                permission={{
                  resource: ResourceType.CONSUMER,
                  action: Action.DELETE,
                  value: consumerGroupID,
                }}
              >
                Delete consumer group
              </ActionDropdownItem>
            </Dropdown>
          )}
        </PageHeading>
      </div>
      <Metrics.Wrapper>
        <Metrics.Section>
          <Metrics.Indicator label="State">
            <Tooltip
              value={
                <Tag color={getTagColor(consumerGroup.data?.state)}>
                  {consumerGroup.data?.state}
                </Tag>
              }
              content={
                CONSUMER_GROUP_STATE_TOOLTIPS[
                  consumerGroup.data?.state || ConsumerGroupState.UNKNOWN
                ]
              }
              placement="bottom-start"
            />
          </Metrics.Indicator>
          <Metrics.Indicator label="Members">
            {consumerGroup.data?.members}
          </Metrics.Indicator>
          <Metrics.Indicator label="Assigned Topics">
            {consumerGroup.data?.topics}
          </Metrics.Indicator>
          <Metrics.Indicator label="Assigned Partitions">
            {consumerGroup.data?.partitions?.length}
          </Metrics.Indicator>
          <Metrics.Indicator label="Coordinator ID">
            {consumerGroup.data?.coordinator?.id}
          </Metrics.Indicator>
          <Metrics.Indicator label="Total lag">
            {consumerGroup.data?.consumerLag || 0}
          </Metrics.Indicator>
        </Metrics.Section>
      </Metrics.Wrapper>
      <ControlPanelWrapper hasInput style={{ margin: '16px 0 20px' }}>
        <Search placeholder="Search by Topic Name" />
        <label>
          <Switch
            name="ShowLaggingConsumers"
            checked={showLagging}
            onChange={handleSwitch}
          />
          Show Only Lagging
        </label>
      </ControlPanelWrapper>
      <Table isFullwidth>
        <thead>
          <tr>
            <TableHeaderCell title="Topic" />
            <TableHeaderCell title="Consumer Lag" />
          </tr>
        </thead>
        <tbody>
          {currentPartitionsByTopic.map((key) => (
            <ListItem
              clusterName={clusterName}
              consumers={partitionsByTopic[key]}
              name={key}
              key={key}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Details;
