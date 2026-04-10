import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface WebFlowScheduleAttributes {
  id: number;
  userId: number;
  webFlowId: number;
  name: string | null;
  cronExpression: string;
  timezone: string;
  enabled: boolean;
  envFileId: number | null;
  nextRunAt: Date | null;
  lastRunAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WebFlowScheduleCreationAttributes
  extends Optional<
    WebFlowScheduleAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'name' | 'envFileId' | 'nextRunAt' | 'lastRunAt' | 'timezone'
  > {}

class WebFlowSchedule
  extends Model<WebFlowScheduleAttributes, WebFlowScheduleCreationAttributes>
  implements WebFlowScheduleAttributes
{
  public id!: number;
  public userId!: number;
  public webFlowId!: number;
  public name!: string | null;
  public cronExpression!: string;
  public timezone!: string;
  public enabled!: boolean;
  public envFileId!: number | null;
  public nextRunAt!: Date | null;
  public lastRunAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WebFlowSchedule.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    webFlowId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'web_flow_id',
      references: { model: 'web_flows', key: 'id' },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    cronExpression: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: 'cron_expression',
    },
    timezone: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: 'UTC',
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    envFileId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'env_file_id',
      references: { model: 'env_files', key: 'id' },
      onDelete: 'SET NULL',
    },
    nextRunAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'next_run_at',
    },
    lastRunAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_run_at',
    },
  },
  {
    sequelize,
    modelName: 'WebFlowSchedule',
    tableName: 'web_flow_schedules',
    timestamps: true,
  }
);

export default WebFlowSchedule;
