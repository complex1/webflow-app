import { DataTypes, Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_PATH || './database.sqlite',
  logging: process.env.DEBUG_LOGS === 'true' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

/** Add `variable_pool` when upgrading an existing SQLite DB (sync alter is off). */
export async function ensureWebFlowExecutionVariablePoolColumn(): Promise<void> {
  const qi = sequelize.getQueryInterface();
  try {
    const desc = await qi.describeTable('web_flow_executions');
    if (!desc.variable_pool) {
      await qi.addColumn('web_flow_executions', 'variable_pool', {
        type: DataTypes.JSON,
        allowNull: true,
      });
    }
  } catch (e) {
    console.warn('[db] Could not ensure web_flow_executions.variable_pool:', e);
  }
}

/** Add public share columns when upgrading an existing SQLite DB (sync alter is off). */
export async function ensureWebFlowPublicShareColumns(): Promise<void> {
  const qi = sequelize.getQueryInterface();
  try {
    const desc = await qi.describeTable('web_flows');
    if (!desc.public_share_enabled) {
      await qi.addColumn('web_flows', 'public_share_enabled', {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }
    if (!desc.public_share_token) {
      await qi.addColumn('web_flows', 'public_share_token', {
        type: DataTypes.STRING(64),
        allowNull: true,
      });
    }
  } catch (e) {
    console.warn('[db] Could not ensure web_flows public share columns:', e);
  }
}

/** Add `schedule_id` when upgrading an existing SQLite DB (sync alter is off). */
export async function ensureWebFlowExecutionScheduleIdColumn(): Promise<void> {
  const qi = sequelize.getQueryInterface();
  try {
    const desc = await qi.describeTable('web_flow_executions');
    if (!desc.schedule_id) {
      await qi.addColumn('web_flow_executions', 'schedule_id', {
        type: DataTypes.INTEGER,
        allowNull: true,
      });
    }
  } catch (e) {
    console.warn('[db] Could not ensure web_flow_executions.schedule_id:', e);
  }
}

export default sequelize;
