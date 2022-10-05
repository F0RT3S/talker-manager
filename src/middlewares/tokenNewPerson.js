const tokenPerson = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ message: 'Token não encontrado' });
  }

  if (token.length !== 16) {
    res.status(401).json({ message: 'Token inválido' });
  }
  next();
};

module.exports = tokenPerson;