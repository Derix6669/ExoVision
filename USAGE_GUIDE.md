# ExoVision - Інструкція з використання

## Огляд
ExoVision має два режими роботи:
1. **ML Classification** - Класифікація екзопланет за допомогою машинного навчання
2. **Discovery** - Освітній додаток для вивчення екзопланет

## ML Classification Mode

### 1. Завантаження моделі (Model Upload)

**Підтримувані формати:**
- ✅ **`.pkl` - Scikit-learn моделі (pickle) - РЕКОМЕНДОВАНО**
- `.joblib` - Scikit-learn моделі (joblib)
- `.h5` - Keras/TensorFlow моделі
- `.pt`, `.pth` - PyTorch моделі

**Формат .pkl (Pickle):**
Це основний формат для збереження scikit-learn моделей. Якщо ви тренували модель за допомогою scikit-learn (RandomForest, LogisticRegression, SVM тощо), використовуйте саме цей формат.

**Приклад збереження моделі в .pkl:**
\`\`\`python
import pickle
from sklearn.ensemble import RandomForestClassifier

# Тренування моделі
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Збереження в .pkl формат
with open('exoplanet_model.pkl', 'wb') as f:
    pickle.dump(model, f)
\`\`\`

**Як завантажити:**
1. Перетягніть файл моделі (.pkl) в зону "Upload Model File"
2. Або натисніть "Select File" і виберіть файл
3. Дочекайтеся завершення завантаження (прогрес-бар покаже статус)
4. Після завантаження з'явиться повідомлення "Model ready for predictions"

### 2. Прогнозування (Predictions)

**Ручне введення даних:**
1. Заповніть форму з параметрами екзопланети:
   - **Orbital Period** - орбітальний період (дні)
   - **Transit Duration** - тривалість транзиту (години)
   - **Transit Depth** - глибина транзиту (ppm)
   - **Planet Radius** - радіус планети (радіуси Землі)
   - **Signal to Noise** - співвідношення сигнал/шум
   - **KOI Score** - оцінка KOI (0-1)
2. Натисніть "Predict"
3. Результат покаже: клас (Confirmed/False Positive) та впевненість моделі

**Завантаження CSV файлу:**
1. Перейдіть на вкладку "CSV Upload"
2. Завантажте CSV файл з даними про кандидатів
3. Файл має містити колонки: orbital_period, transit_duration, transit_depth, planet_radius, signal_to_noise, koi_score
4. Отримаєте результати для всіх записів

### 3. Візуалізації (Visualizations)

Після виконання прогнозів доступні:
- **Confusion Matrix** - матриця помилок моделі
- **Feature Importance** - важливість ознак
- **SHAP Values** - пояснення прогнозів моделі

### 4. Донавчання моделі (Model Retraining)

**Підготовка даних:**
Створіть CSV файл з такими колонками:
\`\`\`csv
orbital_period,transit_duration,transit_depth,planet_radius,signal_to_noise,koi_score,label
365.25,3.5,1000,1.2,15.5,0.85,1
\`\`\`

**Колонки:**
- `orbital_period` - орбітальний період (дні)
- `transit_duration` - тривалість транзиту (години)
- `transit_depth` - глибина транзиту (ppm)
- `planet_radius` - радіус планети (радіуси Землі)
- `signal_to_noise` - співвідношення сигнал/шум
- `koi_score` - оцінка KOI (0-1)
- `label` - цільова змінна (0 = false positive, 1 = confirmed)

**Процес донавчання:**
1. Встановіть розмір тестової вибірки (Test Set Size) - рекомендовано 0.2 (20%)
2. Натисніть "Select File" і виберіть CSV файл
3. Дочекайтеся завершення тренування
4. Перегляньте метрики:
   - **Accuracy** - точність моделі
   - **Precision** - прецизійність
   - **Recall** - повнота
   - **F1 Score** - F1-міра

## Запуск Backend

Для роботи ML функціоналу потрібно запустити Python backend:

\`\`\`bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
\`\`\`

Backend буде доступний на `http://localhost:8000`

## API Endpoints

- `POST /api/upload-model` - завантаження моделі
- `POST /api/predict` - одиночний прогноз
- `POST /api/predict/batch` - пакетний прогноз
- `POST /api/predict/csv` - прогноз з CSV
- `GET /api/visualizations/confusion-matrix` - матриця помилок
- `GET /api/visualizations/feature-importance` - важливість ознак
- `GET /api/visualizations/shap` - SHAP значення
- `GET /api/stats` - статистика моделі
- `POST /api/retrain` - донавчання моделі

## Discovery Mode

Освітній режим для вивчення екзопланет:
- Пошук та фільтрація екзопланет
- Статистика відкриттів
- Порівняння планет
- Інформація про методи відкриття

## Підтримка

Якщо виникли проблеми:
1. Переконайтеся, що backend запущений
2. Перевірте формат файлів (модель, CSV)
3. Перегляньте консоль браузера для помилок
4. Перевірте логи backend
