from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from logica import integral, latex_check



app = FastAPI()

# Configuración para permitir todas las solicitudes CORS
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options("/calculadora", include_in_schema=False)
def options_calculadora():
    return {}

@app.options("/comprobacion", include_in_schema=False)
def options_calculadora():
    return {}

class DatosOperacion(BaseModel):
    operandos: str

@app.post("/calculadora")
async def calcular_operacion(datos: DatosOperacion):
    operandos = datos.operandos
    resultado = integral(operandos)

    return {"resultado": resultado}

@app.post("/comprobacion")
async def comprobar_operacion(datos: DatosOperacion):
    
    operandos = datos.operandos
    resultado2 = latex_check(operandos)

    return {"resultado": resultado2}

import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
