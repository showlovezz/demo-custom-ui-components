import React from 'react';
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react';

import Menu, { MenuProps } from './Menu';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';

const testProps: MenuProps = {
	defaultIndex: '0',
	onSelect: jest.fn(),
	className: 'test',
};

const testVerProps: MenuProps = {
	defaultIndex: '0',
	mode: 'vertical',
	defaultOpenSubMenus: ['4'],
};

const GenerateMenu = (props: MenuProps) => {
	return (
		<Menu {...props}>
			<MenuItem>active</MenuItem>
			<MenuItem disabled>disabled</MenuItem>
			<MenuItem>third item</MenuItem>
			<SubMenu title='dropdown'>
				<MenuItem>dropdown 1</MenuItem>
			</SubMenu>
			<SubMenu title='submenu 2'>
				<MenuItem>dropdown 2</MenuItem>
			</SubMenu>
		</Menu>
	);
};

const createStyleFile = () => {
	const cssFile = `
		.viking-submenu {
			display: none;
		}
		.viking-submenu.menu-opened {
			display: block;
		}
	`;
	const style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = cssFile;

	return style;
};

let wrapper: RenderResult,
	wrapper2: RenderResult,
	menuElement: HTMLElement,
	activeElement: HTMLElement,
	disabledElement: HTMLElement;

// 每一個 Case 跑完，都會執行 cleanup function
describe('test Menu and MenuItem component in default(horizontal) mode', () => {
	beforeEach(() => {
		wrapper = render(GenerateMenu(testProps));
		wrapper.container.append(createStyleFile());
		menuElement = wrapper.getByTestId('test-menu');
		activeElement = wrapper.getByText('active');
		disabledElement = wrapper.getByText('disabled');
	});

	it('should render correct Menu and MenuItem based on default props', () => {
		expect(menuElement).toBeInTheDocument();
		expect(menuElement).toHaveClass('viking-menu test');
		expect(menuElement.querySelectorAll(':scope > li').length).toEqual(5);
		expect(activeElement).toHaveClass('menu-item is-active');
		expect(disabledElement).toHaveClass('menu-item is-disabled');
	});

	it('click items should change active and call the right callback', () => {
		const thirdItem = wrapper.getByText('third item');

		fireEvent.click(thirdItem);
		expect(thirdItem).toHaveClass('is-active');
		expect(activeElement).not.toHaveClass('is-active');
		expect(testProps.onSelect).toHaveBeenCalledWith('2');

		fireEvent.click(disabledElement);
		expect(disabledElement).not.toHaveClass('is-active');
		expect(testProps.onSelect).not.toHaveBeenCalledWith('1');
	});

	it('should show dropdown items when hover on subMenu', async () => {
		expect(wrapper.queryByText('dropdown 1')).not.toBeVisible();

		const dropdownElement = wrapper.getByText('dropdown');

		fireEvent.mouseEnter(dropdownElement);
		await waitFor(() => {
			expect(wrapper.queryByText('dropdown 1')).toBeVisible();
		});

		fireEvent.click(wrapper.getByText('dropdown 1'));
		expect(testProps.onSelect).toHaveBeenCalledWith('3-0');

		fireEvent.mouseLeave(dropdownElement);
		await waitFor(() => {
			expect(wrapper.queryByText('dropdown 1')).not.toBeVisible();
		});
	});
});

describe('test Menu and MenuItem component in vertical mode', () => {
	beforeEach(() => {
		wrapper2 = render(GenerateMenu(testVerProps));
		wrapper2.container.append(createStyleFile());
	});

	it('should render vertical mode when mode is set to vertical', () => {
		const menuElement = wrapper2.getByTestId('test-menu');

		expect(menuElement).toHaveClass('menu-vertical');
	});

	it('should show dropdown items when click on subMenu for vertical mode', () => {
		const dropDownItem = wrapper2.queryByText('dropdown 1');

		expect(dropDownItem).not.toBeVisible();

		fireEvent.click(wrapper2.getByText('dropdown'));
		expect(dropDownItem).toBeVisible();
	});

	it('should show subMenu dropdown when defaultOpenSubMenus contains SubMenu index', () => {
		expect(wrapper2.queryByText('dropdown 2')).toBeVisible();
	});
});
