import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import Button, { ButtonProps, ButtonSize, ButtonType } from './index';

const onClickProps: ButtonProps = {
	onClick: jest.fn(),
};

const defaultProps: ButtonProps = {
	btnType: ButtonType.Primary,
	size: ButtonSize.Large,
	className: 'custom-class',
};

const disabledProps: ButtonProps = {
	disabled: true,
	onClick: jest.fn(),
};

describe('test Button Component', () => {
	it('should render the correct default button', () => {
		const wrapper = render(<Button {...onClickProps}>Button</Button>);
		const element = wrapper.getByText('Button') as HTMLButtonElement;

		fireEvent.click(element);
		expect(onClickProps.onClick).toHaveBeenCalled();

		expect(element).toBeInTheDocument();
		expect(element.disabled).toBeFalsy();
		expect(element.tagName).toEqual('BUTTON');
		expect(element).toHaveClass('btn btn-default');
	});

	it('should render the correct component based on different props', () => {
		const wrapper = render(<Button {...defaultProps}>Button</Button>);
		const element = wrapper.getByText('Button');

		expect(element).toBeInTheDocument();
		expect(element).toHaveClass('btn-primary btn-lg custom-class');
	});

	it('should render a link when btnType equals link and href is provided', () => {
		const wrapper = render(
			<Button btnType={ButtonType.Link} href='https://www.google.com'>
				Link
			</Button>,
		);
		const element = wrapper.getByText('Link');

		expect(element).toBeInTheDocument();
		expect(element.tagName).toEqual('A');
		expect(element).toHaveClass('btn btn-link');
	});

	it('should render disabled button when disabled set to true', () => {
		const wrapper = render(<Button {...disabledProps}>Button</Button>);
		const element = wrapper.getByText('Button') as HTMLButtonElement;

		fireEvent.click(element);
		expect(disabledProps.onClick).not.toHaveBeenCalled();

		expect(element).toBeInTheDocument();
		expect(element.disabled).toBeTruthy();
	});
});
