import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [demoStep, setDemoStep] = useState(0);
  const [practiceCode, setPracticeCode] = useState(`# Создание словаря
my_dict = {}

# Заполнение случайными элементами
import random
for i in range(5):
    key = f"ключ_{i}"
    value = random.randint(1, 100)
    my_dict[key] = value

# Сортировка по значениям
sorted_dict = dict(sorted(my_dict.items(), key=lambda x: x[1]))

print(sorted_dict)`);
  const [demoDict, setDemoDict] = useState<Record<string, number>>({});
  const [sortedDict, setSortedDict] = useState<Record<string, number>>({});

  const demoSteps = [
    {
      title: 'Шаг 1: Создание словаря',
      description: 'Начнём с пустого словаря',
      code: 'my_dict = {}',
      icon: 'BookOpen'
    },
    {
      title: 'Шаг 2: Заполнение данными',
      description: 'Добавим 5 случайных элементов',
      code: `import random
for i in range(5):
    key = f"элемент_{i}"
    value = random.randint(1, 100)
    my_dict[key] = value`,
      icon: 'Database'
    },
    {
      title: 'Шаг 3: Сортировка по значениям',
      description: 'Отсортируем словарь по значениям',
      code: 'sorted_dict = dict(sorted(my_dict.items(), key=lambda x: x[1]))',
      icon: 'ArrowUpDown'
    },
    {
      title: 'Результат',
      description: 'Готово! Словарь отсортирован',
      code: 'print(sorted_dict)',
      icon: 'CheckCircle2'
    }
  ];

  const runDemo = () => {
    if (demoStep === 0) {
      setDemoDict({});
      setSortedDict({});
    } else if (demoStep === 1) {
      const newDict: Record<string, number> = {};
      for (let i = 0; i < 5; i++) {
        newDict[`элемент_${i}`] = Math.floor(Math.random() * 100) + 1;
      }
      setDemoDict(newDict);
    } else if (demoStep === 2) {
      const entries = Object.entries(demoDict);
      entries.sort((a, b) => a[1] - b[1]);
      setSortedDict(Object.fromEntries(entries));
    }
    
    if (demoStep < demoSteps.length - 1) {
      setDemoStep(demoStep + 1);
    }
  };

  const resetDemo = () => {
    setDemoStep(0);
    setDemoDict({});
    setSortedDict({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <Icon name="Code2" size={40} className="text-primary animate-bounce-gentle" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Изучаем Python: Словари
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Интерактивная платформа для изучения работы со словарями в Python
          </p>
        </div>

        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="demo" className="gap-2">
              <Icon name="Play" size={16} />
              Демонстрация
            </TabsTrigger>
            <TabsTrigger value="practice" className="gap-2">
              <Icon name="Edit3" size={16} />
              Практика
            </TabsTrigger>
            <TabsTrigger value="theory" className="gap-2">
              <Icon name="BookMarked" size={16} />
              Теория
            </TabsTrigger>
          </TabsList>

          <TabsContent value="demo" className="space-y-6 animate-fade-in">
            <Card className="shadow-xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name={demoSteps[demoStep].icon as any} className="text-primary" />
                  {demoSteps[demoStep].title}
                </CardTitle>
                <CardDescription className="text-base">
                  {demoSteps[demoStep].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-slate-950 text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{demoSteps[demoStep].code}</pre>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={runDemo} 
                    size="lg"
                    disabled={demoStep === demoSteps.length - 1}
                    className="gap-2"
                  >
                    <Icon name="Play" size={18} />
                    {demoStep === 0 ? 'Начать демонстрацию' : 'Следующий шаг'}
                  </Button>
                  <Button 
                    onClick={resetDemo} 
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <Icon name="RotateCcw" size={18} />
                    Сбросить
                  </Button>
                </div>

                {demoStep > 0 && (
                  <div className="grid md:grid-cols-2 gap-4 animate-slide-in-right">
                    <Card className="bg-accent/50">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Icon name="Database" size={20} />
                          Исходный словарь
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(demoDict).length === 0 ? (
                            <p className="text-muted-foreground italic">Пусто</p>
                          ) : (
                            Object.entries(demoDict).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-center bg-background p-3 rounded">
                                <span className="font-mono text-sm">{key}</span>
                                <Badge variant="secondary" className="text-base">
                                  {value}
                                </Badge>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {demoStep >= 2 && (
                      <Card className="bg-primary/5 border-primary/30">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2 text-primary">
                            <Icon name="ArrowUpDown" size={20} />
                            Отсортированный
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {Object.entries(sortedDict).map(([key, value], idx) => (
                              <div 
                                key={key} 
                                className="flex justify-between items-center bg-background p-3 rounded border-2 border-primary/20"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                              >
                                <span className="font-mono text-sm">{key}</span>
                                <Badge className="text-base">
                                  {value}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 justify-center pt-4">
                  {demoSteps.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === demoStep ? 'w-8 bg-primary' : 'w-2 bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practice" className="space-y-6 animate-fade-in">
            <Card className="shadow-xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Code" className="text-secondary" />
                  Попробуй сам!
                </CardTitle>
                <CardDescription className="text-base">
                  Измени код и посмотри, как он работает. Попробуй изменить количество элементов или диапазон значений.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={practiceCode}
                  onChange={(e) => setPracticeCode(e.target.value)}
                  className="w-full h-80 bg-slate-950 text-green-400 p-6 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  spellCheck={false}
                />
                
                <div className="flex gap-3">
                  <Button size="lg" className="gap-2">
                    <Icon name="Play" size={18} />
                    Запустить код
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Icon name="Copy" size={18} />
                    Скопировать
                  </Button>
                </div>

                <Card className="bg-accent/30">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Icon name="Lightbulb" size={18} className="text-secondary" />
                      Подсказки для практики
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Icon name="Check" size={16} className="text-primary mt-0.5" />
                        <span>Попробуй изменить <code className="bg-muted px-2 py-0.5 rounded">range(5)</code> на другое число</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="Check" size={16} className="text-primary mt-0.5" />
                        <span>Измени диапазон случайных чисел <code className="bg-muted px-2 py-0.5 rounded">randint(1, 100)</code></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="Check" size={16} className="text-primary mt-0.5" />
                        <span>Для обратной сортировки добавь <code className="bg-muted px-2 py-0.5 rounded">reverse=True</code></span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theory" className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="BookOpen" className="text-primary" />
                    Что такое словарь?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>
                    Словарь в Python — это структура данных, которая хранит пары "ключ-значение". 
                    Каждому уникальному ключу соответствует определённое значение.
                  </p>
                  <div className="bg-accent/50 p-4 rounded-lg">
                    <code className="text-xs">
                      my_dict = &#123;"имя": "Иван", "возраст": 25&#125;
                    </code>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Zap" className="text-secondary" />
                    Зачем нужны словари?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-primary mt-0.5" />
                      <span>Быстрый поиск данных по ключу</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-primary mt-0.5" />
                      <span>Хранение связанных данных</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-primary mt-0.5" />
                      <span>Удобная работа с настройками</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Plus" className="text-primary" />
                    Создание словаря
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="space-y-2">
                    <p className="font-medium">Пустой словарь:</p>
                    <div className="bg-slate-950 text-green-400 p-3 rounded font-mono text-xs">
                      my_dict = &#123;&#125;
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">С данными:</p>
                    <div className="bg-slate-950 text-green-400 p-3 rounded font-mono text-xs">
                      my_dict = &#123;"a": 1, "b": 2&#125;
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="ArrowUpDown" className="text-secondary" />
                    Сортировка словаря
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>
                    Для сортировки используем функцию <code className="bg-muted px-2 py-0.5 rounded">sorted()</code> 
                    с параметром <code className="bg-muted px-2 py-0.5 rounded">key</code>:
                  </p>
                  <div className="bg-slate-950 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
                    sorted_dict = dict(sorted(<br/>
                    &nbsp;&nbsp;my_dict.items(),<br/>
                    &nbsp;&nbsp;key=lambda x: x[1]<br/>
                    ))
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
