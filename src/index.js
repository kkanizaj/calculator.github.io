import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

const DisplayWindow = (props) => (
    <div>
        <input className='expression' type='text' value={props.expression} disabled={true}/>
    </div>
);

class Button extends React.Component {
    constructor() {
        super();

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.onKeyPressed(this.props.text);
    }

    render() {
        return <button className={this.props.className} onClick={this.onClick}>
                    {this.props.text}
               </button>;
    }
}

class Calculator extends React.Component {
    constructor () {
        super();

        this.state = {
            expression: ''
        };

        this.onKeyPressed = this.onKeyPressed.bind(this);
        this.onEvaluatePressed = this.onEvaluatePressed.bind(this);
        this.onDeletePressed = this.onDeletePressed.bind(this);
    }

    setClassAttribute(bool){
        for (let index = 0; index < document.getElementsByClassName("operation").length; ++index) {
           if(bool)
               document.getElementsByClassName("operation")[index].setAttribute("disabled", 'disabled');

           else document.getElementsByClassName("operation")[index].removeAttribute("disabled");
        }
    }


    onKeyPressed(input) {
        const operations = ['/', '*', '+', '-'];
        let flag = false;
        if (operations.indexOf(input) > -1) {
            if (this.state.expression === '') flag = true;

            this.setClassAttribute(true);
        }
        else {
            this.setClassAttribute(false);
        }

        if(!flag)
            this.setState((prev) => ({expression: prev.expression + input}));
    }


    onEvaluatePressed() {

        if (this.state.expression !== ''){
        fetch('/api/hello', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                expression: this.state.expression})
        }).then(response => response.text())
          .then(data => {
                this.setState({expression: data});
              console.log('post request response data', data);
                });
        }
    }

    onDeletePressed() {
        this.setState((prev) => ({
            expression: prev.expression.length <= 1 ? '' : prev.expression.slice(0, -1)}));

        this.setClassAttribute(false);
    }

    renderNumberKey(key) {
        return <Button
            className="key" text={key} onKeyPressed={this.onKeyPressed}
        />
    }

    renderOperationKey(key) {
        return <Button
            className="operation" text={key} onKeyPressed={this.onKeyPressed}
        />
    }

    renderDelete() {
        return <Button
            className="delete" text="C" onKeyPressed={this.onDeletePressed}
        />
    }


    render() {

        return (
            <div className='container'>
                <div className='calculator'>
                    <div className='expression-screen'>
                    <DisplayWindow expression={this.state.expression}/>
                    </div>
                    <div className="key-row">
                        {this.renderNumberKey(7)}
                        {this.renderNumberKey(8)}
                        {this.renderNumberKey(9)}
                        {this.renderOperationKey('/')}
                    </div>
                    <div className="key-row">
                        {this.renderNumberKey(4)}
                        {this.renderNumberKey(5)}
                        {this.renderNumberKey(6)}
                        {this.renderOperationKey('*')}
                    </div>
                    <div className="key-row">
                        {this.renderNumberKey(1)}
                        {this.renderNumberKey(2)}
                        {this.renderNumberKey(3)}
                        {this.renderOperationKey('-')}
                    </div>
                    <div className="key-row">
                        {this.renderNumberKey(0)}
                        {this.renderDelete()}
                        <button className='operation equals' onClick={this.onEvaluatePressed}>=</button>
                        {this.renderOperationKey('+')}
                    </div>
                </div>
            </div>
        )
    }
}
ReactDOM.render(<Calculator />, document.getElementById('root'));


serviceWorker.unregister();
