《日日安心》訪客圖片放這裡

規格：
- 尺寸：1200 × 900 像素（4:3 橫式）
- 格式：JPG
- 品質：建議 80%（檔案約 80–180 KB）
- 風格：水彩繪本感，主體居中

═══════════════════════════════════════════════════════
白天 / 晚上版本
═══════════════════════════════════════════════════════

App 會依照「使用者今天第一次打開的時段」自動選圖：
- 早上 5:00 – 晚上 6:00（18:00）→ 顯示 _day 版
- 晚上 6:00 – 隔天早上 5:00 → 顯示 _night 版

檔名規則（小寫、底線分隔、副檔名 .jpg）：

白天版（背景明亮、暖陽、藍天等）：
- kiwi_day.jpg              奇異鳥（白天）
- turtle_day.jpg            海龜（白天）
- sparrow_day.jpg           麻雀（白天）
- butterfly_day.jpg         蝴蝶（白天）
- owl_nordic_day.jpg        貓頭鷹（白天）
- cat_traveler_day.jpg      貓咪旅人（白天）
- penguin_day.jpg           企鵝（白天）
- deer_day.jpg              小鹿（白天）
- duck_day.jpg              鴨子（白天）
- panda_day.jpg             熊貓（白天）
- pigeon_postman_day.jpg        鴿子郵差（白天）
- tuxedo_cat_ny_day.jpg         紐約賓士貓（白天）
- shiba_brothers_kyoto_day.jpg  柴犬兄弟（白天）
- french_marmot_day.jpg         法國土撥鼠（白天）
- egypt_camel_day.jpg           埃及駱駝（白天）
- red_fox_london_day.jpg        倫敦紅狐狸（白天）

晚上版（夜空、月亮、星星、暖燈等）：
- kiwi_night.jpg            奇異鳥（晚上）
- turtle_night.jpg          海龜（晚上）
- sparrow_night.jpg         麻雀（晚上）
- butterfly_night.jpg       蝴蝶（晚上）
- owl_nordic_night.jpg      貓頭鷹（晚上）
- cat_traveler_night.jpg    貓咪旅人（晚上）
- penguin_night.jpg         企鵝（晚上）
- deer_night.jpg            小鹿（晚上）
- duck_night.jpg            鴨子（晚上）
- panda_night.jpg           熊貓（晚上）
- pigeon_postman_night.jpg        鴿子郵差（晚上）
- tuxedo_cat_ny_night.jpg         紐約賓士貓（晚上）
- shiba_brothers_kyoto_night.jpg  柴犬兄弟（晚上）
- french_marmot_night.jpg         法國土撥鼠（晚上）
- egypt_camel_night.jpg           埃及駱駝（晚上）
- red_fox_london_night.jpg        倫敦紅狐狸（晚上）

═══════════════════════════════════════════════════════
圖片載入順序（fallback chain）
═══════════════════════════════════════════════════════

App 載入訪客圖時會依序嘗試：

1. 「動物名_day.jpg」或「動物名_night.jpg」← 優先
2. 「動物名.jpg」← 通用版（單一圖片）
3. 對應的 emoji（🐢 🦋 🦉 …）← 最後 fallback

所以你可以分階段準備：
- 完全沒做：顯示 emoji
- 只放單張通用版（例如 kiwi.jpg）：所有時段都用它
- 完整準備白天/晚上兩版：依時段自動切換

═══════════════════════════════════════════════════════
V1.8: 同一動物的多場景（場景變體）
═══════════════════════════════════════════════════════

同一隻動物可以有多個場景變體（例如貓咪在咖啡廳、在公園、
在窗邊），每個場景有自己的圖、自己的文案。

觸發時機：
- 第一次見面：用主場景（無後綴）
- 回訪（>14 天沒見，25% 機率）：隨機從所有場景中挑一個

檔名規則：
   <動物id>_<場景id>_<day/night>.jpg

範例（cat_traveler 有 cafe 場景）：
- cat_traveler_day.jpg              主場景（白天）
- cat_traveler_night.jpg            主場景（晚上）
- cat_traveler_cafe_day.jpg         咖啡廳（白天）
- cat_traveler_cafe_night.jpg       咖啡廳（晚上）

場景命名原則：
- 全小寫、英文、底線分隔
- 以「地點/環境」為主：cafe, park, window, garden,
  kitchen, bookshop, market, bridge, forest, beach,
  temple, station, rooftop ...
- 簡短（1-2 個字）

收藏邏輯：
- 不同場景算不同收藏品，使用者可以收藏「cat_traveler 在
  咖啡廳」+「cat_traveler 在公園」兩張
- 收藏冊會把它們當作兩個獨立的紀錄顯示

要新增場景：請聯絡開發者，需要在 app.js 的 VISITORS
陣列裡為該動物加上 scenes 欄位（含 title/greeting/
invitation/tag 文案），然後把對應圖檔放進這個資料夾。

═══════════════════════════════════════════════════════
另外：安靜日靜物圖
═══════════════════════════════════════════════════════

App 還有「沒有訪客」的安靜日（10% 機率），那時會顯示
靜物風景圖。靜物圖檔案放在另一個資料夾：

   images/quiet/

詳細規格請看那邊的 README.txt。
