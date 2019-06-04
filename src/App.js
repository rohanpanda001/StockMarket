import React, { Component } from 'react';
import axios from 'axios';
import { Menu, Dropdown, Icon, Input, Button } from 'antd';
import './App.css';
import LineChart from './LineChart/LineChart';

class App extends Component {
  state = {
    currencies: [],
    currentCurrency: '',
    stocksData: [],
    timeIndex: 1,
    pip: 1,
  }
  componentDidMount() {
    const ws = new WebSocket('wss://stocksimulator.intuhire.com');
    this.ws = ws;
    ws.onmessage = this.handleData;


    axios.get(`https://restsimulator.intuhire.com/currency_pairs`)
      .then(res => {
        const { data = [] } = res;
        const currencies = data.map(obj => obj.currency_name)
        this.setState({ currencies, currentCurrency: currencies[0] });
        ws.onopen = () => {
          ws.send(JSON.stringify({currencyPair: currencies[0]}));
        };
      })
  }

  handleData = (data) => {
    const val = data.data;
    const { stocksData } = this.state;

    let newStocksData = stocksData;
    newStocksData.push(val);
    if (newStocksData.length > 10) {
      newStocksData = newStocksData.slice(1)
    }

    this.setState({ stocksData: newStocksData, currentData: val });

  }

  onCurrencyChange = (currency) => {
    this.setState({ currentCurrency: currency});
    this.ws.send(JSON.stringify({currencyPair: currency}));
  }

  render() {
    const { currencies, currentCurrency, stocksData = [], pip, currentData } = this.state;
    const chartsData = stocksData.map((stock, index) => {
      return { a: index+1, b: stock };
    });
    const size = stocksData.length;
    const c = stocksData[size-1];
    const b = stocksData[size-2];
    const a = stocksData[size-3];
    const val = (a/b)-c;

    const button = val > (pip/ 10000) ? 'Sell' : 'Buy';

    const menu = (
      <Menu>
        { currencies.map((currency, index) => 
          <Menu.Item key={index}>
            <span onClick={() => this.onCurrencyChange(currency)}>{currency}</span>
          </Menu.Item>
        )}
      </Menu>
    );
    return (
      <div className="App" style={{ marginTop: '20px'}}>
        <span style={{ marginRight: '10px'}}>Select Currency:</span>
        <Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link" href="#">
            {currentCurrency ? currentCurrency : 'Select Currency'}
            <Icon type="down" />
          </a>
        </Dropdown>
        <div>
          <Input placeholder="Enter pip (N)" style={{ width: '200px', marginTop: '20px' }} onChange={(e) => this.setState({ pip: e.target.value }) }/>
        </div>
        <h3 style={{ marginTop: '20px'}}>{currentData}</h3>
        <div style={{ marginTop: '20px'}}>
          <LineChart data={chartsData} width={700} height={350} margin={20} />
        </div>
        <Button type="primary">{button}</Button>
      </div>


    );;
  }
}

export default App;
