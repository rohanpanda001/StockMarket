import React, { Component } from 'react';
import axios from 'axios';
import { Menu, Dropdown, Icon } from 'antd';
import './App.css';

class App extends Component {
  state = {
    currencies: [],
    currentCurrency: '',
  }
  componentDidMount() {
    axios.get(`https://restsimulator.intuhire.com/currency_pairs`)
      .then(res => {
        const { data = [] } = res;
        const currencies = data.map(obj => obj.currency_name)
        this.setState({ currencies, currentCurrency: currencies[0] });
      })
  }

  handleChange = (event) => {
    console.log(event)
  }

  render() {
    const { currencies, currentCurrency } = this.state;
    const menu = (
      <Menu>
        { currencies.map((currency, index) => 
          <Menu.Item key={index}>
            <span onClick={() => this.setState({ currentCurrency: currency})}>{currency}</span>
          </Menu.Item>
        )}
      </Menu>
    );
    return (
      <div className="App" style={{ paddingTop: '20px'}}>
        <Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link" href="#">
            {currentCurrency ? currentCurrency : 'Select Currency'} <Icon type="down" />
          </a>
        </Dropdown>
      </div>
    );
  }
}

export default App;
