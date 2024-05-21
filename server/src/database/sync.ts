import sequelize from ".";

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((err) => {
    console.error("Error creating database:", err);
  });
