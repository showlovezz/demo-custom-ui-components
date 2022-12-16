import React, {
	createContext,
	CSSProperties,
	FunctionComponentElement,
	ReactNode,
	useState,
} from 'react';
import classNames from 'classnames';

import { MenuItemProps } from './MenuItem';

type MenuMode = 'horizontal' | 'vertical';
type SelectCallback = (selectedIndex: string) => void;

export interface MenuProps {
	defaultIndex?: string;
	className?: string;
	mode?: MenuMode;
	style?: CSSProperties;
	onSelect?: SelectCallback;
	children?: ReactNode;
	defaultOpenSubMenus?: string[];
}

interface MenuContext {
	index: string;
	onSelect?: SelectCallback;
	mode?: MenuMode;
	defaultOpenSubMenus?: string[];
}

export const MenuContext = createContext<MenuContext>({ index: '0' });

const Menu = ({
	className,
	children,
	defaultIndex = '0',
	defaultOpenSubMenus = [],
	onSelect,
	style,
	mode = 'horizontal',
}: MenuProps) => {
	const [currentActive, setActive] = useState(defaultIndex);

	const classes = classNames('viking-menu', className, {
		'menu-vertical': mode === 'vertical',
		'menu-horizontal': mode !== 'vertical',
	});

	// useMemo sample
	// const classes = useMemo(() => {
	// 	return classNames('viking-menu', className, {
	// 		'menu-vertical': mode === 'vertical',
	// 		'menu-horizontal': mode !== 'vertical',
	// 	});
	// }, [className, mode]);

	const handleClick = (index: string) => {
		setActive(index);

		if (onSelect) {
			onSelect(index);
		}
	};

	// useCallback sample
	// const handleClick = useCallback(
	// 	(index: string) => {
	// 		setActive(index);

	// 		if (onSelect) {
	// 			onSelect(index);
	// 		}
	// 	},
	// 	[onSelect],
	// );
	const passedContext: MenuContext = {
		index: currentActive ? currentActive : '0',
		onSelect: handleClick,
		mode,
		defaultOpenSubMenus,
	};

	const renderChildren = () => {
		return React.Children.map(children, (child, index) => {
			const childElement = child as FunctionComponentElement<MenuItemProps>;
			const { displayName } = childElement.type;

			if (displayName === 'MenuItem' || displayName === 'SubMenu') {
				return React.cloneElement(childElement, {
					index: index.toString(),
				});
			} else {
				console.error('Warning: Menu has a child which is not a MenuItem component');
			}
		});
	};

	// useCallback sample
	// const renderChildren = useCallback(() => {
	// 	return React.Children.map(children, (child, index) => {
	// 		const childElement = child as FunctionComponentElement<MenuItemProps>;
	// 		const { displayName } = childElement.type;
	// 		if (displayName === 'MenuItem' || displayName === 'SubMenu') {
	// 			return React.cloneElement(childElement, {
	// 				index: index.toString(),
	// 			});
	// 		} else {
	// 			console.error('Warning: Menu has a child which is not a MenuItem component');
	// 		}
	// 	});
	// }, [children]);

	return (
		<ul className={classes} style={style} data-testid='test-menu'>
			<MenuContext.Provider value={passedContext}>{renderChildren()}</MenuContext.Provider>
		</ul>
	);
};

export default Menu;
