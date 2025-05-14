import * as React from 'react';
import { IconType } from 'react-icons';

interface IconWrapperProps {
  icon: IconType;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({ icon }) => {
  // Using createElement with a type assertion
  return React.createElement(icon as unknown as React.ComponentType<{}>);
};
