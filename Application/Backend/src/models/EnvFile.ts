import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface EnvFileAttributes {
  id: number;
  name: string;
  description: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EnvFileCreationAttributes extends Optional<EnvFileAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class EnvFile extends Model<EnvFileAttributes, EnvFileCreationAttributes> implements EnvFileAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EnvFile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'EnvFile',
    tableName: 'env_files',
  }
);

// Associations will be defined in a separate file to avoid circular dependencies

export default EnvFile;
