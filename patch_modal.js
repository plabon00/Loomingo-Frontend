/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

const path = '/Users/plabansarkar/Dev Enviorment/Loomingo Frontend/my-app/components/AutoDM/AutoDMManager.tsx';
let content = fs.readFileSync(path, 'utf8');

const step2StartRegex = /\{\/\* SCREEN 2: Initial Message & Follow Gate \*\/\}/;
const step3StartRegex = /\{\/\* SCREEN 3: Final Goal \/ Link \*\/\}/;
const explicitBackNavRegex = /\{\/\* Explicit Back & Next Footer Navigation \*\/\}/;

const step2StartIdx = content.search(step2StartRegex);
const step3StartIdx = content.search(step3StartRegex);
const explicitBackNavIdx = content.search(explicitBackNavRegex);

if (step2StartIdx === -1 || step3StartIdx === -1 || explicitBackNavIdx === -1) {
    console.error("Could not find boundaries.");
    process.exit(1);
}

const beforeStep2 = content.substring(0, step2StartIdx);
const afterStep3 = content.substring(explicitBackNavIdx);

const newStep2And3 = `
              {/* SCREEN 2: Initial Message & Follow Gate */}
              {modalStep === 2 && (
                <div className="space-y-5">
                  <div className="p-5 border border-zinc-200 rounded-2xl bg-white shadow-sm space-y-5 animate-in fade-in duration-200">
                    <div>
                      <label className="text-sm font-semibold text-zinc-900 mb-3 block">
                        Opening DM Text
                      </label>
                      <textarea
                        className={uniformTextAreaClass}
                        value={formData.openingMessage.text}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            openingMessage: {
                              ...formData.openingMessage,
                              text: e.target.value,
                            },
                          })
                        }
                        placeholder="Hey there! Ready to get started?"
                      />
                    </div>

                    <div className="space-y-2 pt-2 border-t border-zinc-100">
                      <label className="text-[10px] font-bold block text-zinc-400 uppercase tracking-widest mt-3">
                        Quick Reply Button
                      </label>
                      <Input
                        className={uniformButtonInputClass}
                        value={formData.openingMessage.button.text}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            openingMessage: {
                              ...formData.openingMessage,
                              button: {
                                ...formData.openingMessage.button,
                                text: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="Button Text"
                      />
                    </div>
                  </div>

                  {/* Require Follow up to Step 2 as requested */}
                  <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm mt-4">
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900">Require Follow?</h4>
                      <p className="text-xs text-zinc-500 mt-1">
                        User must follow you to get the final link.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          requireFollow: !formData.requireFollow,
                        })
                      }
                      className={\`w-12 h-6 rounded-full transition-colors relative shadow-inner \${formData.requireFollow ? "bg-zinc-900" : "bg-zinc-200"}\`}
                    >
                      <div
                        className={\`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform \${formData.requireFollow ? "translate-x-6" : "translate-x-0.5"}\`}
                      />
                    </button>
                  </div>

                  {/* Ask Follow Form (Appears immediately if Yes) */}
                  {formData.requireFollow && (
                    <div className="p-5 border border-zinc-200 bg-white rounded-2xl space-y-5 animate-in slide-in-from-top-2 fade-in duration-200 shadow-sm">
                      <div>
                        <label className="text-sm font-semibold mb-3 flex items-center text-zinc-900">
                          Follow Request Message
                        </label>
                        <textarea
                          className={uniformTextAreaClass}
                          value={formData.askFollowMessage.text}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              askFollowMessage: {
                                ...formData.askFollowMessage,
                                text: e.target.value,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="space-y-3 pt-3 border-t border-zinc-100">
                        <Input
                          value={
                            formData.askFollowMessage.buttons[0]?.text || ""
                          }
                          onChange={(e) => {
                            const newBtns = [
                              ...formData.askFollowMessage.buttons,
                            ];
                            if (!newBtns[0])
                              newBtns[0] = { text: "", url: "" };
                            newBtns[0].text = e.target.value;
                            setFormData({
                              ...formData,
                              askFollowMessage: {
                                ...formData.askFollowMessage,
                                buttons: newBtns,
                              },
                            });
                          }}
                          className={uniformButtonInputClass}
                          placeholder="Button 1 (e.g. I Followed!)"
                        />
                        <div className="relative">
                          <div
                            className={\`\${uniformButtonInputClass} flex items-center justify-center bg-zinc-50 border-dashed text-zinc-400 select-none cursor-not-allowed hover:bg-zinc-50\`}
                          >
                            <Lock className="size-3 mr-2" /> Visit Profile
                            (Auto-Linked)
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SCREEN 3: Final Goal / Link */}
              {modalStep === 3 && (
                <div className="space-y-5">
                  
                  {/* Template Type Selector */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-zinc-900 block">
                      Final Delivery Template
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            templateType: "TEXT_BUTTON",
                          })
                        }
                        className={\`p-4 border-2 rounded-2xl text-left transition-all \${
                          formData.templateType === "TEXT_BUTTON"
                            ? "border-zinc-900 bg-zinc-50 shadow-md"
                            : "border-zinc-200 bg-white hover:border-zinc-300"
                        }\`}
                      >
                        <Type className="size-5 mb-2 text-zinc-700" />
                        <p className="text-sm font-semibold text-zinc-900">
                          Text + Link Buttons
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-1">
                          Simple text with up to 3 links
                        </p>
                      </button>
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            templateType: "BANNER_BUTTON",
                          })
                        }
                        className={\`p-4 border-2 rounded-2xl text-left transition-all \${
                          formData.templateType === "BANNER_BUTTON"
                            ? "border-zinc-900 bg-zinc-50 shadow-md"
                            : "border-zinc-200 bg-white hover:border-zinc-300"
                        }\`}
                      >
                        <ImageIcon className="size-5 mb-2 text-zinc-700" />
                        <p className="text-sm font-semibold text-zinc-900">
                          Card Carousel
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-1">
                          Image cards with buttons
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="p-5 border border-zinc-200 rounded-2xl bg-white shadow-sm space-y-5">
                    <div>
                      <label className="text-sm font-semibold text-zinc-900 mb-3 block">
                        Final Message Text
                      </label>
                      <p className="text-xs text-zinc-500 mb-3">Which type of response do you want for your audience?</p>
                      <textarea
                        className={uniformTextAreaClass}
                        value={formData.finalGoalMessage.text}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            finalGoalMessage: {
                              ...formData.finalGoalMessage,
                              text: e.target.value,
                            },
                          })
                        }
                        placeholder="Here is your requested content!"
                      />
                    </div>

                    {/* TEXT_BUTTON Final Links */}
                    {formData.templateType === "TEXT_BUTTON" && (
                      <div className="space-y-3 pt-2 border-t border-zinc-100 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between mb-2 mt-2">
                          <label className="text-[10px] font-bold block text-zinc-400 uppercase tracking-widest">
                            Attached Links
                          </label>
                          <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                            {formData.finalGoalMessage.buttons.length}/3
                          </span>
                        </div>

                        {formData.finalGoalMessage.buttons.map((btn, idx) => (
                          <div
                            key={idx}
                            className="relative p-4 border border-zinc-200 bg-zinc-50/50 rounded-xl space-y-3"
                          >
                            <div className="flex items-center justify-between pb-1">
                              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                Button {idx + 1}
                              </span>
                              <button
                                onClick={() => removeFinalButton(idx)}
                                className="text-zinc-400 hover:text-red-600 p-1 bg-white border border-zinc-200 rounded-md transition-colors"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>

                            <Input
                              className={uniformButtonInputClass}
                              placeholder="Label (e.g. Download Now)"
                              value={btn.text}
                              onChange={(e) =>
                                updateFinalButton(idx, "text", e.target.value)
                              }
                            />

                            <Input
                              className="text-sm bg-white border border-zinc-200 rounded-xl h-11 focus-visible:ring-zinc-300 px-4 text-zinc-900 placeholder:text-zinc-400 shadow-sm"
                              placeholder="🔗 URL (https://...)"
                              value={btn.url}
                              onChange={(e) =>
                                updateFinalButton(idx, "url", e.target.value)
                              }
                            />
                          </div>
                        ))}

                        {formData.finalGoalMessage.buttons.length < 3 && (
                          <Button
                            variant="outline"
                            className="w-full border-dashed border-2 border-zinc-200 text-zinc-700 font-medium mt-3 h-11 text-sm rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition-all"
                            onClick={addFinalButton}
                          >
                            <Plus className="mr-2 size-4" /> Add Another Link
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CAROUSEL / BANNER_BUTTON Fields */}
                  {formData.templateType === "BANNER_BUTTON" && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      {/* Horizontal Scroll Area for Elements */}
                      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory">
                        {formData.elements.map((elem, eIdx) => (
                          <div key={elem.id} className="min-w-[320px] max-w-[320px] shrink-0 border border-zinc-200 bg-white rounded-3xl p-5 shadow-sm snap-center">
                            
                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Card {eIdx + 1}</span>
                              {formData.elements.length > 1 && (
                                <button
                                  onClick={() => setFormData(prev => ({ ...prev, elements: prev.elements.filter((_, i) => i !== eIdx) }))}
                                  className="p-1 hover:bg-red-50 text-zinc-400 hover:text-red-500 rounded-full transition-colors"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              )}
                            </div>

                            {/* Image Upload */}
                            <div className="mb-4">
                              {elem.imageUrl ? (
                                <div className="relative rounded-xl overflow-hidden border border-zinc-200">
                                  <img src={elem.imageUrl} alt="Banner" className="w-full h-32 object-cover" />
                                  <button
                                    onClick={() => setFormData(prev => ({
                                      ...prev,
                                      elements: prev.elements.map((el, i) => i === eIdx ? { ...el, imageUrl: "", imageFile: null } : el)
                                    }))}
                                    className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                                  >
                                    <X className="size-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-200 rounded-xl cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-all">
                                  <Upload className="size-6 text-zinc-300 mb-2" />
                                  <span className="text-xs text-zinc-500 font-medium">Upload Image</span>
                                  <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="hidden" onChange={handleImageSelect(elem.id)} />
                                </label>
                              )}
                            </div>

                            {/* Title & Subtitle */}
                            <div className="space-y-3 mb-5">
                              <div>
                                <Input
                                  className="bg-zinc-50 border-zinc-200 focus-visible:ring-zinc-300 rounded-xl text-sm h-10 font-semibold"
                                  value={elem.title}
                                  onChange={(e) => {
                                    if (e.target.value.length <= 80)
                                      setFormData(prev => ({
                                        ...prev,
                                        elements: prev.elements.map((el, i) => i === eIdx ? { ...el, title: e.target.value } : el)
                                      }));
                                  }}
                                  placeholder="Title (Max 80)"
                                  maxLength={80}
                                />
                              </div>
                              <div>
                                <Input
                                  className="bg-zinc-50 border-zinc-200 focus-visible:ring-zinc-300 rounded-xl text-xs h-10"
                                  value={elem.subtitle}
                                  onChange={(e) => {
                                    if (e.target.value.length <= 80)
                                      setFormData(prev => ({
                                        ...prev,
                                        elements: prev.elements.map((el, i) => i === eIdx ? { ...el, subtitle: e.target.value } : el)
                                      }));
                                  }}
                                  placeholder="Subtitle (Max 80)"
                                  maxLength={80}
                                />
                              </div>
                            </div>

                            {/* Buttons Builder (Max 2 for generic) */}
                            <div className="space-y-3 pt-3 border-t border-zinc-100">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Buttons</span>
                                <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">{elem.buttons.length}/2</span>
                              </div>
                              
                              {elem.buttons.map((btn, bIdx) => (
                                <div key={bIdx} className="space-y-2 relative group">
                                  <div className="flex items-center gap-2">
                                    <select
                                      value={btn.type}
                                      onChange={(e) => {
                                        const newType = e.target.value as "web_url" | "postback";
                                        setFormData(prev => ({
                                          ...prev,
                                          elements: prev.elements.map((el, i) => i === eIdx ? {
                                            ...el, buttons: el.buttons.map((b, bi) => bi === bIdx ? { ...b, type: newType } : b)
                                          } : el)
                                        }));
                                      }}
                                      className="text-[10px] font-bold text-zinc-600 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1.5 cursor-pointer outline-none"
                                    >
                                      <option value="web_url">🔗 Link</option>
                                      <option value="postback">⚡ Action</option>
                                    </select>
                                    
                                    <Input
                                      className={uniformButtonInputClass}
                                      placeholder="Button Text"
                                      value={btn.title}
                                      onChange={(e) => {
                                        setFormData(prev => ({
                                          ...prev,
                                          elements: prev.elements.map((el, i) => i === eIdx ? {
                                            ...el, buttons: el.buttons.map((b, bi) => bi === bIdx ? { ...b, title: e.target.value } : b)
                                          } : el)
                                        }));
                                      }}
                                    />
                                    
                                    {elem.buttons.length > 1 && (
                                      <button
                                        onClick={() => {
                                          setFormData(prev => ({
                                            ...prev,
                                            elements: prev.elements.map((el, i) => i === eIdx ? {
                                              ...el, buttons: el.buttons.filter((_, bi) => bi !== bIdx)
                                            } : el)
                                          }));
                                        }}
                                        className="text-zinc-400 hover:text-red-500 p-1.5 shrink-0 transition-colors"
                                      >
                                        <Trash2 className="size-4" />
                                      </button>
                                    )}
                                  </div>
                                  
                                  {btn.type === "web_url" && (
                                    <Input
                                      className="text-xs bg-zinc-50 border-zinc-200 rounded-xl h-9 px-3 w-full"
                                      placeholder="https://..."
                                      value={btn.url}
                                      onChange={(e) => {
                                        setFormData(prev => ({
                                          ...prev,
                                          elements: prev.elements.map((el, i) => i === eIdx ? {
                                            ...el, buttons: el.buttons.map((b, bi) => bi === bIdx ? { ...b, url: e.target.value } : b)
                                          } : el)
                                        }));
                                      }}
                                    />
                                  )}
                                </div>
                              ))}
                              
                              {elem.buttons.length < 2 && (
                                <button
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      elements: prev.elements.map((el, i) => i === eIdx ? {
                                        ...el, buttons: [...el.buttons, { type: "postback", title: "Action", url: "", payload: "" }]
                                      } : el)
                                    }));
                                  }}
                                  className="w-full mt-2 text-xs font-semibold text-zinc-600 bg-zinc-50 border border-zinc-200 border-dashed rounded-xl py-2 hover:bg-zinc-100 transition-colors"
                                >
                                  + Add Button
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {/* Add Card Button */}
                        {formData.elements.length < 10 && (
                          <div 
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                elements: [...prev.elements, {
                                  id: \`elem_\${Date.now()}\`,
                                  imageUrl: "", imageFile: null, title: "", subtitle: "",
                                  buttons: [{ type: "postback", title: "Button", url: "", payload: "" }]
                                }]
                              }));
                            }}
                            className="min-w-[80px] shrink-0 border-2 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-zinc-300 hover:bg-zinc-50 transition-all text-zinc-400 group"
                          >
                            <CopyPlus className="size-6 group-hover:scale-110 transition-transform mb-2" />
                            <span className="text-[10px] font-bold uppercase">Add Card</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
`;

const finalContent = beforeStep2 + newStep2And3 + "\n" + afterStep3;
fs.writeFileSync(path, finalContent, 'utf8');
console.log("Patched successfully!");
