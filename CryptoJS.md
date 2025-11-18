# AES 核心概念
AES的学习可以看[B站视频](https://www.bilibili.com/video/BV1seFJeHEnm/?spm_id_from=333.337.search-card.all.click&vd_source=5b44e789c3417bff8a1a68483f131aed)
## `CryptoJS.AES`的使用
四个参数：key, mode, padding, IV
- key: 密钥，加密 / 解密的核心钥匙，字符串长度16/24/32个字符
- mode: 模式，加密算法的工作模式，常用 CBC（推荐，需 IV）
- padding: 填充，当明文长度不是加密块（128 位）整数倍时补全，常用 Pkcs7（默认）
- IV：偏移量，配合 CBC 等模式使用，避免相同明文加密出相同密文，必须是 128 位（16 个字符），需随机生成（解密时需用相同 IV）
