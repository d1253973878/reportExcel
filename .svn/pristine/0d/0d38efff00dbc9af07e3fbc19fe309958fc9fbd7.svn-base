import React, { useState } from 'react';
import { Input, InputNumber } from 'antd';

interface RangeInputProps {
  value?: any[];
  isNumber?: boolean;
  onChange?: (value: any[]) => void;
}

/**
 * 字符、数值范围输入表单组件
 */
const RangeInput: React.FC<RangeInputProps> = ({ value = [], isNumber = false, onChange }) => {
  const [min, setMin] = useState(value.length > 0 ? value[0] : '');
  const [max, setMax] = useState(value.length > 1 ? value[1] : '');
  const triggerChange = (value: { min?: any; max?: any }) => {
    if (onChange) {
      onChange([min, max]);
    }
  };

  const onMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMin(e.target.value);
    triggerChange({ min: e.target.value });
  };

  const onMinNumberChange = (value: any) => {
    setMin(value);
    triggerChange({ min: value });
  };

  const onMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMax(e.target.value);
    triggerChange({ max: e.target.value });
  };

  const onMaxNumberChange = (value: any) => {
    setMax(value);
    triggerChange({ max: value });
  };

  return (
    <span>
      {isNumber ? (
        <InputNumber onChange={onMinNumberChange} style={{ width: 100 }}></InputNumber>
      ) : (
        <Input type="text" value={min} onChange={onMinChange} style={{ width: 100 }} />
      )}
      &nbsp;~&nbsp;
      {isNumber ? (
        <InputNumber onChange={onMaxNumberChange} style={{ width: 100 }}></InputNumber>
      ) : (
        <Input type="text" value={max} onChange={onMaxChange} style={{ width: 100 }} />
      )}
    </span>
  );
};

export default RangeInput;
