# **Web3 大学平台 – 链上合约 PRD（Smart Contract PRD v1.0）**

---

# **1. 合约总览（Contract Overview）**

平台包含五类核心智能合约：

| 合约名称                | 类型       | 功能             |
| ------------------- | -------- | -------------- |
| **YIDENGToken**     | ERC20 代币 | 平台支付、学习挖矿奖励    |
| **CourseManager**   | 合约管理器    | 创建课程、购买课程、资金分配 |
| **CourseNFT (SBT)** | NFT/SBT  | 课程访问凭证（不可转让）   |
| **RewardPool**      | 奖励池      | 分发学习挖矿奖励       |
| **AAVEAdapter**     | 协议调用适配   | 作者收益质押到 AAVE   |

所有合约遵循：

- Solidity 0.8.x

- OpenZeppelin 标准库

- 防重入（ReentrancyGuard）

- 事件完整记录（EVM Logs）

- RBAC 权限管理（AccessControl）

- 可升级性（UUPS optional）

---

# **2. 合约架构图（文字版）**

```
                   ┌─────────────────────────┐
                   │      YIDENG Token        │
                   └───────────▲─────────────┘
                               │ transfer / approve
                               │
┌──────────────────┐     ┌─────┴──────────────┐
│ Course NFT (SBT) │◄────┤   CourseManager    │
└───────▲──────────┘     └───────▲────────────┘
        │ mint()                 │ buyCourse()
        │                        │ createCourse()
        │                        │
        │                 ┌──────┴──────────────┐
        │                 │     RewardPool       │
        │                 └──────────▲───────────┘
        │                            │ rewardUser()
        │                            │
        │                 ┌──────────┴──────────────┐
        │                 │      AAVEAdapter         │
        │                 └──────────────────────────┘
```

---

# **3. 合约角色与权限（RBAC）**

| 角色                          | 权限              |
| --------------------------- | --------------- |
| **DEFAULT_ADMIN_ROLE**      | 修改重要配置、添加角色     |
| **COURSE_CREATOR_ROLE**     | 创建课程            |
| **REWARD_DISTRIBUTOR_ROLE** | 调用 rewardUser() |
| **STAKING_OPERATOR_ROLE**   | 执行 AAVE 质押操作    |

链上权限与后台权限不完全一致，后台只能触发链上接口，不能绕过链上安全限制。

---

# **4. 合约需求明细（Contract Requirements）**

---

# **4.1 YIDENGToken（ERC20 Token）**

## 功能需求

| 编号        | 描述                                     |
| --------- | -------------------------------------- |
| SC-TK-001 | 发行平台代币，总量可控                            |
| SC-TK-002 | 用于购买课程                                 |
| SC-TK-003 | 用于奖励学习者                                |
| SC-TK-004 | 支持 `approve/spend` 购买课程                |
| SC-TK-005 | 支持奖励池 mint（仅限 REWARD_DISTRIBUTOR_ROLE） |

## 事件

- `Mint(address to, uint256 value)`

- `Burn(address from, uint256 value)`

---

# **4.2 CourseManager（课程管理器）**

该合约是平台最核心的业务合约，负责：

- 创建课程（作者）

- 课程上链存储

- 支付处理（YIDENG/ETH）

- NFT 发行

- 收益分配（作者钱包）

## 数据结构

```solidity
struct Course {
    uint256 id;
    address author;
    uint256 price;
    bool isActive;
}
```

## 功能需求

| 编号        | 描述             |
| --------- | -------------- |
| SC-CM-001 | 作者可创建课程        |
| SC-CM-002 | 设置课程价格         |
| SC-CM-003 | 购买课程时扣除用户代币    |
| SC-CM-004 | 自动 mint SBT 凭证 |
| SC-CM-005 | 防止重复购买         |
| SC-CM-006 | 购买记录可链上验证      |
| SC-CM-007 | 作者可领取课程收入      |

## 关键函数

```solidity
function createCourse(uint256 price) external returns(uint256);
function buyCourse(uint256 courseId) external payable;
function withdraw(uint256 courseId) external;
```

## 事件

- `CourseCreated(courseId, author, price)`

- `CoursePurchased(courseId, buyer)`

- `CourseWithdraw(courseId, author, amount)`

---

# **4.3 CourseNFT（SBT 不可转让 NFT）**

## 核心需求

| 功能         | 描述                    |
| ---------- | --------------------- |
| SC-NFT-001 | 购买课程后 mint            |
| SC-NFT-002 | tokenId 与 courseId 对应 |
| SC-NFT-003 | SBT：禁止 `transferFrom` |
| SC-NFT-004 | 链上课程访问凭证              |
| SC-NFT-005 | 可查询所有拥有课程的用户          |

## 必须覆盖的重写

```solidity
function _transfer(...) internal override {
    revert("SBT: non-transferable");
}
```

## 数据结构

```
tokenId => courseId
courseId => [tokenId...]
user => [tokenId...]
```

---

# **4.4 RewardPool（奖励池）**

负责：

- 学习挖矿奖励

- 代币发放

- 防重复领取

- 后端统一执行（避免前端作弊）

## 功能需求

| 编号        | 描述           |
| --------- | ------------ |
| SC-RP-001 | 校验调用者是否有奖励权限 |
| SC-RP-002 | 给用户奖励 YIDENG |
| SC-RP-003 | 防重复发放奖励      |
| SC-RP-004 | 奖励发放记录链上可查   |

## 关键函数

```solidity
function rewardUser(address user, uint256 amount) external onlyRewarder;
```

## 事件

- `RewardIssued(user, amount)`

---

# **4.5 AAVEAdapter（AAVE 质押模块）**

为作者提供链上收益管理能力。

## 功能需求

| 编号        | 描述                    |
| --------- | --------------------- |
| SC-AA-001 | 支持 ETH / USDT 质押      |
| SC-AA-002 | 调用 AAVE supply() 存入资产 |
| SC-AA-003 | 支持 withdraw() 提取本金收益  |
| SC-AA-004 | 记录质押量、收益（索引）          |
| SC-AA-005 | 仅创作者可质押自己的收入          |

## 关键函数

```solidity
function supplyETH(address author) external payable;
function supplyERC20(address author, address token, uint256 amount) external;
function withdraw(address token, uint256 amount) external;
```

## 外部依赖

基于 AAVE 官方地址（V3）：

```
IPoolAaveV3
DataProvider
Oracle
```

---

# **5. 合约间交互流程**

---

## 5.1 课程购买流程（链上）

```
User → approve(YIDENG, CourseManager)
User → CourseManager.buyCourse()

CourseManager:
    验证价格
    transferFrom User → Author
    CourseNFT.mint(user, courseId)
```

---

## 5.2 学习挖矿奖励流程

```
Backend → RewardPool.rewardUser(user, amount)
RewardPool → mint YIDENG to user
```

链上校验逻辑确保奖励不可伪造。

---

## 5.3 AAVE 质押流程

```
Author → approve(USDT, Adapter)
Author → Adapter.supplyERC20()
Adapter → AAVE Pool → 存入资产
```

---

# **6. 安全需求（Security Requirements）**

| 风险      | 要求                      |
| ------- | ----------------------- |
| 重入攻击    | 所有外部调用使用 nonReentrant   |
| SBT 被转让 | 禁止 transfer/approve     |
| 权限滥用    | RBAC + 多签可选             |
| 奖励滥发    | 仅 RewardDistributor 可调用 |
| 质押安全    | Adapter 绑定固定 AAVE 合约地址  |
| 价格操纵    | 课程价格写死链上不可改             |

---

# **7. Gas 优化需求**

- 使用 `uint256` 而非 `uint`

- 使用 `mapping(uint → struct)` 优于 `array` 遍历

- 课程 ID 自增，避免复杂索引

- reward 用户时批量操作（可选）

---

# **8. 可升级性需求**

可选 UUPS（OpenZeppelin Upgradable）：

- 课程系统可能后期增加更多逻辑（章节权限 NFT）

- 奖励机制可能更换发放规则

强制要求：

- 不允许升级改变 NFT 不可转让属性

- 不允许升级修改用户历史奖励数据

---

# **9. 审计关注点（Audit Notes）**

- 所有 transferFrom 前必须检查 allowance

- NFT mint 的权限必须严格控制

- CourseManager 的 withdraw 必须验证作者身份

- AAVEAdapter 禁止任意地址调用 supply/withdraw

- 整体依赖 AAVE 的 pool 地址必须 immutable

---


