import React, { CSSProperties, ReactNode, useContext } from 'react';
import classNames from 'classnames';

import { MenuContext } from './Menu';

export interface MenuItemProps {
	index?: string;
	disabled?: boolean;
	className?: string;
	style?: CSSProperties;
	children: ReactNode;
}

const MenuItem = ({ className, children, disabled, index, style }: MenuItemProps) => {
	const context = useContext(MenuContext);
	const classes = classNames('menu-item', className, {
		'is-disabled': disabled,
		'is-active': context.index === index,
	});

	const handleClick = () => {
		if (context.onSelect && !disabled && typeof index === 'string') {
			context.onSelect(index);
		}
	};

	// useCallback sample
	// const handleClick = useCallback(() => {
	// 	if (context.onSelect && !disabled && typeof index === 'string') {
	// 		context.onSelect(index);
	// 	}
	// }, [context, disabled, index]);

	return (
		<li className={classes} style={style} onClick={handleClick}>
			{children}
		</li>
	);
};

MenuItem.displayName = 'MenuItem';

export default MenuItem;
