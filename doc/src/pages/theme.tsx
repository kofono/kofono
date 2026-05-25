export default function () {
    return (
        <div class="p-4 space-y-8">
            <h1 class="text-3xl font-bold">Theme Preview</h1>

            {/* Colors */}
            <section>
                <h2 class="text-xl font-semibold mb-4">Colors</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Base colors */}
                    <div class="bg-base-100 h-16 rounded flex items-center justify-center text-base-content">
                        --color-base-100
                    </div>
                    <div class="bg-base-200 h-16 rounded flex items-center justify-center text-base-content">
                        --color-base-200
                    </div>
                    <div class="bg-base-300 h-16 rounded flex items-center justify-center text-base-content">
                        --color-base-300
                    </div>
                    <div class="bg-base-content h-16 rounded flex items-center justify-center text-base-100">
                        --color-base-content
                    </div>
                    {/* Primary colors */}
                    <div class="bg-primary h-16 rounded flex items-center justify-center text-primary-content font-semibold">
                        --color-primary
                    </div>
                    <div class="bg-primary-content h-16 rounded flex items-center justify-center text-primary font-semibold">
                        --color-primary-content
                    </div>
                    {/* Secondary colors */}
                    <div class="bg-secondary h-16 rounded flex items-center justify-center text-secondary-content font-semibold">
                        --color-secondary
                    </div>
                    <div class="bg-secondary-content h-16 rounded flex items-center justify-center text-secondary font-semibold">
                        --color-secondary-content
                    </div>
                    {/* Accent colors */}
                    <div class="bg-accent h-16 rounded flex items-center justify-center text-accent-content font-semibold">
                        --color-accent
                    </div>
                    <div class="bg-accent-content h-16 rounded flex items-center justify-center text-accent font-semibold">
                        --color-accent-content
                    </div>
                    {/* Neutral colors */}
                    <div class="bg-neutral h-16 rounded flex items-center justify-center text-neutral-content font-semibold">
                        --color-neutral
                    </div>
                    <div class="bg-neutral-content h-16 rounded flex items-center justify-center text-neutral font-semibold">
                        --color-neutral-content
                    </div>
                    {/* Info colors */}
                    <div class="bg-info h-16 rounded flex items-center justify-center text-info-content font-semibold">
                        --color-info
                    </div>
                    <div class="bg-info-content h-16 rounded flex items-center justify-center text-info font-semibold">
                        --color-info-content
                    </div>
                    {/* Success colors */}
                    <div class="bg-success h-16 rounded flex items-center justify-center text-success-content font-semibold">
                        --color-success
                    </div>
                    <div class="bg-success-content h-16 rounded flex items-center justify-center text-success font-semibold">
                        --color-success-content
                    </div>
                    {/* Warning colors */}
                    <div class="bg-warning h-16 rounded flex items-center justify-center text-warning-content font-semibold">
                        --color-warning
                    </div>
                    <div class="bg-warning-content h-16 rounded flex items-center justify-center text-warning font-semibold">
                        --color-warning-content
                    </div>
                    {/* Error colors */}
                    <div class="bg-error h-16 rounded flex items-center justify-center text-error-content font-semibold">
                        --color-error
                    </div>
                    <div class="bg-error-content h-16 rounded flex items-center justify-center text-error font-semibold">
                        --color-error-content
                    </div>
                </div>
            </section>

            {/* Elements */}
            <section>
                <h2 class="text-xl font-semibold mb-4">Elements</h2>
                <div class="space-y-4">
                    <div class="flex flex-wrap gap-4">
                        <button type="button" class="btn btn-primary">
                            primary button
                        </button>
                        <button type="button" class="btn btn-secondary">
                            secondary button
                        </button>
                        <button type="button" class="btn btn-accent">
                            accent button
                        </button>
                        <button type="button" class="btn btn-outline">
                            outline button
                        </button>
                    </div>

                    <div class="flex flex-wrap gap-4">
                        <label class="label cursor-pointer">
                            <input
                                type="checkbox"
                                checked
                                class="checkbox checkbox-primary"
                            />
                            <span class="label-text">primary checkbox</span>
                        </label>
                        <label class="label cursor-pointer">
                            <input
                                type="checkbox"
                                class="checkbox checkbox-secondary"
                            />
                            <span class="label-text">secondary checkbox</span>
                        </label>
                        <label class="label cursor-pointer">
                            <input
                                type="radio"
                                name="radio-1"
                                checked={true}
                                class="radio radio-primary"
                            />
                            <span class="label-text">primary radio</span>
                        </label>
                        <label class="label cursor-pointer">
                            <input
                                type="radio"
                                name="radio-1"
                                class="radio radio-secondary"
                            />
                            <span class="label-text">secondary radio</span>
                        </label>
                    </div>

                    <div class="flex flex-wrap gap-4">
                        <input
                            type="text"
                            placeholder="input field"
                            class="input input-bordered"
                        />
                        <select class="select select-bordered">
                            <option disabled selected>
                                Pick one
                            </option>
                            <option>Option 1</option>
                            <option>Option 2</option>
                        </select>
                        <textarea
                            class="textarea textarea-bordered"
                            placeholder="textarea"></textarea>
                    </div>

                    <div class="flex flex-wrap gap-4">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value="50"
                            class="range range-primary"
                        />
                        <progress
                            class="progress progress-primary"
                            value="70"
                            max="100"></progress>
                    </div>
                </div>
            </section>
        </div>
    );
}
