import React, { useRef, useEffect } from 'react';
import reportConfig from '../../../../../config/reportConfig';

export interface RightContentProps {
}

/**
 * 报表设计器右边的布局
 * @param props
 */
const RightContent: React.FC<RightContentProps> = (props) => {
  const settingRef = useRef();
  
  useEffect(() => {
    const apiOptions = Object.assign({}, reportConfig);
    newtecChart.init(settingRef.current, {
      api: apiOptions
    });
  }, []);

  return (
    <>
      <div ref={settingRef}></div>
    </>
  );
};

export default RightContent;