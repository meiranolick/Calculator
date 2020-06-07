import React from 'react';
import './App.css';

class Button extends React.Component {
	constructor(props) {
		super(props);
		this.buttonClick = this.buttonClick.bind(this);
	}

	buttonClick(e) {
		this.props.onClicked(e.target.value);
	}

	render() {
		return (
			<input className="Button" type="button" value={this.props.value} onClick={this.buttonClick}>
			</input>
		)
	}
}

class NumberPad extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
		const numberButtons = numbers.map((number) =>
			<Button key={number} value={number} onClicked={this.props.onNumberClicked}/>);
		return (
			<div className="NumberPad">
				{numberButtons}
			</div>
		)
	}
}

class OperatorPad extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const operators = ['+', '-', '*', '/'];
		const operatorButtons = operators.map((operator) =>
			<Button key={'operator_'+operator} value={operator} onClicked={this.props.onOperatorClicked}/>);
		return (
			<div className="NumberPad">
				{operatorButtons}
				<Button key='operator_=' value='=' onClicked={this.props.onEqualsClicked}/>
			</div>
		)
	}
}

class InputField extends React.Component{
	constructor(props) {
		super(props);
	}

	render() {
		const display = this.props.display;

		return (
			<div className="InputField">
				{display}
			</div>
		)
	}
}

class Calculator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {display: '', operations: [], currentNumber: '', operationComplete: false};
	}

	numberClicked(number) {
		if (this.state.operations.length === 0)
			this.setState({display: ''});

		this.setState({
			display: this.state.operationComplete ? number : this.state.display + number,
			currentNumber: Number(this.state.currentNumber + number),
			operationComplete: false
		});
	}

	addOperationToState(operator) {
		let operationSet = this.state.operations;
		operationSet.push({num: this.state.currentNumber, operator: operator});

		return operationSet;
	}

	operatorClicked(operator) {
		if (this.state.currentNumber === '') {
			alert("Please enter a number first");
			return;
		}

		this.setState({
			display: this.state.display + ' ' + operator + ' ',
			operations: this.addOperationToState(operator),
			currentNumber: ''
		});
	}

	runCalculations() {
		let operations = this.addOperationToState();

		// Handle multiplication and division first
		for (let i = 0; i < operations.length; ) {
			switch (operations[i].operator) {
				case '*':
					operations.splice(i, 2, {
						num: operations[i].num * operations[i+1].num,
						operator: operations[i+1].operator
					});
					break;
				case '/':
					operations.splice(i, 2, {
						num: operations[i].num / operations[i+1].num,
						operator: operations[i+1].operator
					});
					break;
				default: i++;
			}
		}

		// Then addition and subtraction
		let result = operations[0].num;
		for (let i = 0; i < operations.length - 1; i++) {
			if (operations[i].operator === '+')
				result += operations[i+1].num;
			else if (operations[i].operator === '-')
				result -= operations[i+1].num;
			else console.log("Whoops! That wasn't supposed to happen...");
		}

		this.setState({
			display: result,
			operations: [],
			currentNumber: '',
			operationComplete: true
		});
	}

	render() {
		const display = this.state.display;

		return (
			<div className="Calculator">
				<InputField display={display} />
				<NumberPad onNumberClicked={this.numberClicked.bind(this)} />
				<OperatorPad
					onOperatorClicked={this.operatorClicked.bind(this)}
					onEqualsClicked={this.runCalculations.bind(this)} />
			</div>
		)
	}
}

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<Calculator />
			</header>
		</div>
	);
}

export default App;
