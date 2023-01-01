import React, {
	FunctionComponentElement,
	MouseEvent,
	ReactNode,
	useCallback,
	useContext,
	useRef,
	useState,
} from 'react';
import classNames from 'classnames';

import { MenuContext } from './Menu';
import { MenuItemProps } from './MenuItem';

export interface SubMenuProps {
	index?: string;
	title: string;
	className?: string;
	children?: ReactNode;
}

const SubMenu = ({ index, title, children, className }: SubMenuProps) => {
	const timer = useRef<number>();
	const context = useContext(MenuContext);
	const openSubMenus = context.defaultOpenSubMenus as Array<string>;
	const isOpened = index && context.mode === 'vertical' ? openSubMenus.includes(index) : false;
	const [menuOpen, setMenuOpen] = useState(isOpened);
	const classes = classNames('menu-item submenu-item', className, {
		'is-active': context.index === index,
		'is-opened': menuOpen,
		'is-vertical': context.mode === 'vertical',
	});
	const handleClick = useCallback(
		(e: MouseEvent) => {
			e.preventDefault();
			setMenuOpen(!menuOpen);
		},
		[menuOpen],
	);
	const handleMouse = useCallback((e: MouseEvent, toggle: boolean) => {
		clearTimeout(timer.current);
		e.preventDefault();

		// 非同步
		timer.current = window.setTimeout(() => {
			setMenuOpen(toggle);
		}, 300);
	}, []);
	const clickEvents =
		context.mode === 'vertical'
			? {
					onClick: handleClick,
			  }
			: {};
	const hoverEvents =
		context.mode !== 'vertical'
			? {
					onMouseEnter: (e: React.MouseEvent) => {
						handleMouse(e, true);
					},
					onMouseLeave: (e: React.MouseEvent) => {
						handleMouse(e, false);
					},
			  }
			: {};
	const renderChildren = () => {
		const subMenuClasses = classNames('viking-submenu', {
			'menu-opened': menuOpen,
		});
		const childrenComponent = React.Children.map(children, (child, childIndex) => {
			const childElement = child as FunctionComponentElement<MenuItemProps>;
			const { displayName } = childElement.type;

			if (displayName === 'MenuItem') {
				return React.cloneElement(childElement, {
					index: `${index}-${childIndex}`,
				});
			} else {
				console.error('Warning: SubMenu has a child which is not a MenuItem component');
			}
		});

		return <ul className={subMenuClasses}>{childrenComponent}</ul>;
	};

	return (
		<li key={index} className={classes} {...hoverEvents}>
			<div className='submenu-title' {...clickEvents}>
				{title}
			</div>
			{renderChildren()}
		</li>
	);
};

SubMenu.displayName = 'SubMenu';

export default SubMenu;
