import React from 'react';
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react';

import Menu, { MenuProps } from './Menu';
import MenuItem from './MenuItem';

const testProps: MenuProps = {
	defaultIndex: '0',
	onSelect: jest.fn(),
	className: 'test',
};

const testVerProps: MenuProps = {
	defaultIndex: '0',
	mode: 'vertical',
};

const GenerateMenu = (props: MenuProps) => {
	return (
		<Menu {...props}>
			<MenuItem>active</MenuItem>
			<MenuItem disabled>disabled</MenuItem>
			<MenuItem>third item</MenuItem>
		</Menu>
	);
};

let wrapper: RenderResult,
	menuElement: HTMLElement,
	activeElement: HTMLElement,
	disabledElement: HTMLElement;

// 每一個 Case 跑完，都會執行 cleanup function
describe('test Menu Component', () => {
	beforeEach(() => {
		wrapper = render(GenerateMenu(testProps));
		menuElement = wrapper.getByTestId('test-menu');
		activeElement = wrapper.getByText('active');
		disabledElement = wrapper.getByText('disabled');
	});

	it('should render correct Menu and MenuItem based on default props', () => {
		expect(menuElement).toBeInTheDocument();
		expect(menuElement).toHaveClass('viking-menu test');
		expect(menuElement.getElementsByTagName('li').length).toEqual(3);
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

	it('should render vertical mode when mode is set to vertical', () => {
		cleanup();

		const wrapper = render(GenerateMenu(testVerProps));
		const menuElement = wrapper.getByTestId('test-menu');

		expect(menuElement).toHaveClass('menu-vertical');
	});
});
