import React, { useState } from 'react';
import Table from 'components/common/NewTable';
import { RouteParamsClusterTopic } from 'lib/paths';
import useAppParams from 'lib/hooks/useAppParams';
import { useTopicConfig } from 'lib/hooks/api/topics';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { TopicConfig } from 'generated-sources';
import { useSearchParams } from 'react-router-dom';
import { ControlPanelWrapper } from 'components/common/ControlPanel/ControlPanel.styled';
import Search from 'components/common/Search/Search';
import Switch from 'components/common/Switch/Switch';
import Tooltip from 'components/common/Tooltip/Tooltip';
import InfoIcon from 'components/common/Icons/InfoIcon';

import * as S from './Settings.styled';

const ValueCell: React.FC<CellContext<TopicConfig, unknown>> = ({
  row,
  renderValue,
}) => {
  const { defaultValue } = row.original;
  const { value } = row.original;
  const hasCustomValue = !!defaultValue && value !== defaultValue;

  return (
    <S.Value $hasCustomValue={hasCustomValue}>{renderValue<string>()}</S.Value>
  );
};

const DefaultValueCell: React.FC<CellContext<TopicConfig, unknown>> = ({
  row,
  getValue,
}) => {
  const defaultValue = getValue<TopicConfig['defaultValue']>();
  const { value } = row.original;
  const hasCustomValue = !!defaultValue && value !== defaultValue;
  return <S.DefaultValue>{hasCustomValue && defaultValue}</S.DefaultValue>;
};

const InfoDocCell: React.FC<CellContext<TopicConfig, unknown>> = ({
  getValue,
}) => {
  const doc = getValue<TopicConfig['doc']>();
  return (
    doc && <Tooltip value={<InfoIcon />} content={doc} placement="bottom-end" />
  );
};

const Settings: React.FC = () => {
  const props = useAppParams<RouteParamsClusterTopic>();
  const { data = [] } = useTopicConfig(props);
  const [filteredData, setFilteredData] = useState(data);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSwitch = () => {
    if (searchParams.has('showCustom')) searchParams.delete('showCustom');
    else searchParams.set('showCustom', 'true');
    setSearchParams(searchParams);
  };

  React.useEffect(() => {
    const query = searchParams.get('q');
    const showCustom = searchParams.get('showCustom') === 'true';
    setFilteredData(
      data.filter(
        (d) =>
          (query === null ||
            query === '' ||
            d.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())) &&
          (!showCustom || (!!d.defaultValue && d.value !== d.defaultValue))
      )
    );
  }, [searchParams]);

  const columns = React.useMemo<ColumnDef<TopicConfig>[]>(
    () => [
      {
        header: 'Key',
        accessorKey: 'name',
        cell: ValueCell,
      },
      {
        header: 'Value',
        accessorKey: 'value',
        cell: ValueCell,
      },
      {
        header: 'Default Value',
        accessorKey: 'defaultValue',
        cell: DefaultValueCell,
      },
      {
        header: '',
        accessorKey: 'doc',
        cell: InfoDocCell,
      },
    ],
    []
  );

  return (
    <S.SettingsWrapper>
      <ControlPanelWrapper hasInput>
        <Search placeholder="Search by Setting Name" />
        <label>
          <Switch
            name="ShowCustomizedValues"
            checked={searchParams.get('showCustom') === 'true'}
            onChange={handleSwitch}
          />
          Show Only Customized Values
        </label>
      </ControlPanelWrapper>
      <Table columns={columns} data={filteredData} />
    </S.SettingsWrapper>
  );
};

export default Settings;
