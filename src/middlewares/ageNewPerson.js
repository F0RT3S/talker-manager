const ageNewPerson = (req, res, next) => {
  const { age } = req.body;

  if (!age) {
    res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }

  if (age < 18) {
    res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }

  next();
};

module.exports = ageNewPerson;