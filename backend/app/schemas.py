from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    class Config:
        orm_mode = True

class ClientCreate(BaseModel):
    name: str
    rnc: str

class ClientOut(BaseModel):
    id: int
    name: str
    rnc: str
    class Config:
        orm_mode = True

class InvoiceCreate(BaseModel):
    client_id: int
    description: str
    amount: float

class InvoiceOut(BaseModel):
    id: int
    client_id: int
    description: str
    amount: float
    status: str
    class Config:
        orm_mode = True

class UserPasswordUpdate(BaseModel):
    current_password: str
    new_password: str
