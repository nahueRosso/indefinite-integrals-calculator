import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';

import Head from 'next/head';
import { BlockMath } from 'react-katex';
import api from './api/index';
import '../app/styles.css';
import axios from 'axios';

interface CalculatorForm {
  operation: string;
  operands: string;
}

const App: React.FC = () => {
  const [showResultBox, setShowResultBox] = useState(false);
  const [calculatorForm, setCalculatorForm] = useState<CalculatorForm>({
    operation: 'addition',
    operands: '3*x',
  });
  const [result, setResult] = useState<string | null>(null);
  const [result2, setResult2] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      const response = await api.post('/calculator', {
        ...calculatorForm,
        operands: calculatorForm.operands,
      });

      if (!response.data.hasOwnProperty('result')) {
        throw new Error('The response does not contain a valid result');
      }

      setResult(response.data.result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 400) {
          alert('Error: The request is incorrect. Check the entered data.');
        } else {
          console.error('Error performing the operation:', error);
          alert('An error occurred while processing the request. Please try again.');
        }
      } else {
        console.error('Error performing the operation:', error);
        alert('An error occurred while processing the request. Please try again.');
      }
    }
  };

  const latexCheck = async () => {
    try {
      const response = await api.post('/check', {
        ...calculatorForm,
        operands: calculatorForm.operands,
      });

      if (!response.data.hasOwnProperty('result')) {
        throw new Error('The response does not contain a valid result');
      }

      setResult2(response.data.result);
      setShowResultBox(true);
    } catch (error) {}
  };

  const closeResultBox = () => {
    setShowResultBox(false);
  };

  const handleInputChange = (name: string, value: string) => {
    setCalculatorForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClick = (value: string) => {
    const lastCharIsOperator = /[+\-*/]$/.test(calculatorForm.operands);
    const nextCharIsOperator = /^[+\-*/]/.test(value);

    if (lastCharIsOperator && nextCharIsOperator) {
      return;
    }
    setCalculatorForm((prevInput) => ({
      ...prevInput,
      operands: prevInput.operands + value.toString(),
    }));
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const key = event.key;

    if (key === 'Backspace') {
      setInput((prevInput) => prevInput.slice(0, -1));
    } else {
      setInput((prevInput) => prevInput + key);
    }
  };

  const handleDelete = () => {
    setCalculatorForm({
      operation: 'addition',
      operands: '',
    });
    setResult(null);
    setResult2(null);
  };

  const [input, setInput] = useState<string>('');

  const buttons: string[] = ['1', '2', '3', '+', '4', '5', '6', '-', '7', '8', '9', '*', 'x', '0', '.', '/'];
  const latexButtons: string[] = ['1', '2', '3', '+', '4', '5', '6', '-', '7', '8', '9', '*', 'x', '0', '.', '/'];

  const sequenceButtons: string[] = ['sin(x)', 'cos(x)', 'tan(x)', 'ln(x)', 'asin(x)', 'acos(x)', 'atan(x)', 'log(x, 2)', 'sqrt(x)', 'root(x,3)', 'Pow(3, x)', 'exp(x)', '(', ')', 'pi', 'x**3'];
  const sequenceLatexButtons: string[] = ['sin(x)', 'cos(x)', 'tan(x)', 'ln(x)', 'sin^{-1}(x)', 'cos^{-1}(x)', 'tan^{-1}(x)', 'log_2(x)', '\\sqrt{x}', '\\sqrt[3]{x}', '3^x', 'e^x', '(', ')', '\\pi', 'x^3'];

  const renderButtons = (arr: string[], arr_2: string[]) => {
    const buttons = [];
    if (arr.length === arr_2.length) {
      for (let i = 0; i < arr.length; i++) {
        buttons.push(
          <button className='button' id={i + '_' + arr[i]} key={i + '_' + arr[i]} onClick={() => handleClick(arr[i])}>
            <BlockMath math={arr_2[i]} />
          </button>
        );
      }
    }
    return buttons;
  };

  return (
    <div className="general">
      <Head>
        <title>Primitive Integral Calculator</title>
        <link rel="icon" href="/calculator.svg" />
      </Head>
      <h1>Primitive Integral Calculator</h1>

      <div className='display'>
        <input
          title='It is not necessary to use the on-screen buttons, you can type directly using the sympy language. Refer to the official documentation if needed.'
          type="text"
          name="operands"
          value={calculatorForm.operands}
          onChange={(e) => handleInputChange(e.target.name, e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleDelete}>Clear All</button>
      </div>

      <div className='buttons-container'>
        <div className='buttons'>
          {renderButtons(buttons, latexButtons)}
        </div>

        <div className='buttons'>
          {renderButtons(sequenceButtons, sequenceLatexButtons)}
        </div>
      </div>

      <button className='button-check' onClick={latexCheck}>Check Operation</button>

      {showResultBox && result2 !== null && (
        <div className='calculator-box check-box'>
          <button className='button-x' onClick={closeResultBox}>X</button>
          <div className='check-child int-box'>
            <p className='integral-titles'>Integral to Perform</p>
            <BlockMath math={'\\int   ' + result2.replace(/\\\\/g, '\\') + '\\quad dx'} />
          </div>
          <button className='button-perform' onClick={fetchTransactions}>Perform Operation</button>

          {result !== null ? (
            <div className='calculator-box perform-box int-box'>
              <p className='integral-titles'  style={{color:'#0e0e0e'}}>Primitive Integral</p>
              <BlockMath math={result.replace(/\\\\/g, '\\') + ' + c \\quad , c \\in \\mathbb{R}\ '} />
            </div>
          ):<div className='calculator-box perform-box'>
            <p style={{color:'#e0e0e0'}}>Integral to Perform</p>
            </div>}
        </div>
      )}

      <div className='documentation'>
        <a className='doc-child' title="The documentation is in sympy, a Python module connected to this application." href="https://docs.sympy.org/latest/modules/integrals/index.html">Official Documentation</a>
      </div>

    </div>
  );
};

export default App;
