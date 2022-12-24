import React from 'react';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

export type ThemeProps =
	| 'primary'
	| 'secondary'
	| 'success'
	| 'info'
	| 'warning'
	| 'danger'
	| 'light'
	| 'dark';

export interface IconProps extends FontAwesomeIconProps {
	theme?: ThemeProps;
}

const Icon = ({ className, theme, ...restProps }: IconProps) => {
	const classes = classNames('viking-icon', className, {
		[`icon-${theme}`]: theme,
	});

	return <FontAwesomeIcon className={classes} {...restProps} />;
};

export default Icon;
