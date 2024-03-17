import React, { useEffect } from 'react';
import { Button } from 'components/common/Button/Button';
import { FormError } from 'components/common/Input/Input.styled';
import Input from 'components/common/Input/Input';
import { InputLabel } from 'components/common/Input/InputLabel.styled';
import EditIcon from 'components/common/Icons/EditIcon';
import CloseIcon from 'components/common/Icons/CloseIcon';
import Heading from 'components/common/heading/Heading.styled';
import MultiSelect from 'components/common/MultiSelect/MultiSelect.styled';
import { Option } from 'react-multi-select-component';

import * as S from './PreviewFields.styled';
import { PreviewFilter } from './Message';

export interface InfoModalProps {
  values: PreviewFilter[];
  toggleIsOpen(): void;
  setFilters: (payload: PreviewFilter[]) => void;
  messageFields: string[];
}

const PreviewFields: React.FC<InfoModalProps> = ({
  values,
  toggleIsOpen,
  setFilters,
  messageFields,
}) => {
  const [displayName, setDisplayName] = React.useState('');
  const [path, setPath] = React.useState<Option>();
  const [errors, setErrors] = React.useState<string[]>([]);
  const [editIndex, setEditIndex] = React.useState<number | undefined>();
  const [showAddField, setShowAddField] = React.useState(false);

  const messageFieldOptions = React.useMemo((): Option[] => {
    return messageFields.map((p) => ({
      label: p,
      value: p,
    }));
  }, [messageFields]);

  const filteredMessageFieldOptions = React.useMemo((): Option[] => {
    return messageFieldOptions.filter(
      (o) => !values.some((v) => v.path === o.value)
    );
  }, [messageFieldOptions, values]);

  const handlePathSelect = (options: Option[]) => {
    setPath(options.length < 1 ? undefined : options[options.length - 1]);
  };

  const handleAccept = () => {
    toggleIsOpen();
  };

  const resetAddField = () => {
    setDisplayName('');
    setPath(undefined);
    setShowAddField(false);
    setEditIndex(undefined);
  };

  const handleOk = () => {
    const newErrors = [];

    const selectedPath = path && path?.value;

    if (!selectedPath) {
      newErrors.push('path');
    }

    if (newErrors?.length) {
      setErrors(newErrors);
      return;
    }

    const newValues = [...values];

    if (typeof editIndex !== 'undefined') {
      newValues.splice(editIndex, 1, {
        displayName,
        path: selectedPath,
      });
    } else {
      newValues.push({ displayName, path: selectedPath });
    }

    resetAddField();
    setFilters(newValues);
  };

  const handleRemove = (filter: PreviewFilter) => {
    const newValues = values.filter((item) => item.path !== filter.path);

    setFilters(newValues);
  };

  const handleEditIndex = (index: number) => {
    setEditIndex(index);
    setShowAddField(true);
  };

  useEffect(() => {
    if (values?.length && typeof editIndex !== 'undefined') {
      setDisplayName(values[editIndex].displayName);
      setPath(
        messageFieldOptions.find((o) => o.value === values[editIndex].path)
      );
    }
  }, [editIndex]);

  return (
    <S.PreviewFields>
      <S.ContentWrapper>
        {values.map((item, index) => (
          <S.EditForm key="index">
            <S.Field>
              {' '}
              {item.displayName} {item.displayName && ':'} {item.path}
            </S.Field>
            <S.EditFilterIcon
              role="button"
              onClick={() => handleEditIndex(index)}
            >
              <EditIcon />
            </S.EditFilterIcon>
            {'  '}
            <S.DeleteFilterIcon
              role="button"
              onClick={() => handleRemove(item)}
            >
              <CloseIcon />
            </S.DeleteFilterIcon>
          </S.EditForm>
        ))}
        {!showAddField &&
          values.length > 0 &&
          filteredMessageFieldOptions.length > 0 && (
            <Button
              buttonSize="M"
              buttonType="primary"
              isInverted
              type="button"
              onClick={() => setShowAddField(true)}
            >
              Add Field Preview
            </Button>
          )}
        {(showAddField || values.length === 0) && (
          <div>
            <Heading level={4}>
              {typeof editIndex !== 'undefined' ? 'Edit' : 'Add'} Field
            </Heading>
            <S.InputWrapper>
              <InputLabel htmlFor="previewFormJsonPath">Json path</InputLabel>
              <MultiSelect
                options={filteredMessageFieldOptions || []}
                value={(path && [path]) || []}
                onChange={handlePathSelect}
                labelledBy="Json Path"
                hasSelectAll={false}
                isCreatable
                closeOnChangedValue
                valueRenderer={(selected) => selected[0] && selected[0].value}
              />
              <FormError>
                {errors.includes('path') && 'Json path is required'}
              </FormError>
            </S.InputWrapper>
            <S.InputWrapper>
              <InputLabel htmlFor="previewFormDisplayName">
                Display Name
              </InputLabel>
              <Input
                type="text"
                id="previewFormDisplayName"
                min="1"
                value={displayName}
                placeholder={(path && path.value) || 'Display Name'}
                onChange={({ target }) => setDisplayName(target?.value)}
              />
            </S.InputWrapper>
            <S.ButtonWrapper>
              {values.length > 0 && (
                <Button
                  buttonSize="M"
                  buttonType="primary"
                  isInverted
                  type="button"
                  onClick={() => resetAddField()}
                >
                  Cancel
                </Button>
              )}
              <Button
                buttonSize="M"
                buttonType="secondary"
                type="button"
                onClick={handleOk}
              >
                {typeof editIndex !== 'undefined' ? 'Save Changes' : 'Add'}
              </Button>
            </S.ButtonWrapper>
          </div>
        )}
      </S.ContentWrapper>
      <S.ButtonWrapper>
        <Button
          buttonSize="M"
          buttonType="secondary"
          type="button"
          onClick={handleAccept}
        >
          Accept
        </Button>
      </S.ButtonWrapper>
    </S.PreviewFields>
  );
};

export default PreviewFields;
