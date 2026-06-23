把两张岩石图放在这个 public/ 目录下，命名如下：

  base.jpg    —— 裸岩版（无植物，鼠标未扫到时显示）
  reveal.jpg  —— 长满苔藓+粉花版（聚光揭示，必须和裸岩版机位/形状对齐）

放好后刷新浏览器即可。public/ 里的文件用 / 开头的绝对路径访问（见 src/data/assets.ts）。
若你的图是 .png/.webp，改对应后缀或同步改 assets.ts 里的文件名。
