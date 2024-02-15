import sympy as sp
from fastapi import HTTPException
from sympy import SympifyError 

def integral (exprecion:str):
    
    try:
        x = sp.symbols('x')
    
        cadena_expresion = exprecion

        expresion_simbolica = sp.sympify(cadena_expresion)

        funcion_a_integrar = expresion_simbolica

        integral_indefinida = sp.integrate(funcion_a_integrar, x)

        latex_code = sp.latex(integral_indefinida).replace('\\', '\\\\')

        return latex_code
    
    except SympifyError as e:
        raise HTTPException(status_code=400, detail=f"Error de sintaxis en la expresión: {e}")
  

def latex_check (exprecion:str): 
    try:
        expresion_simbolica = sp.sympify(exprecion)

        latex_code = sp.latex(expresion_simbolica).replace('\\', '\\\\')

        return latex_code
    except SympifyError as e:
        raise HTTPException(status_code=400, detail=f"Error de sintaxis en la expresión: {e}")
    



