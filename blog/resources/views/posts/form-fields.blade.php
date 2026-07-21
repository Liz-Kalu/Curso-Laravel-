<div>
    <x-input-label for="title" :value="('Title')"/>
    <x-text-input id="title"
                  name="title"
                  type="text"
                  value="{{old('title',$post->title)}}"
                  class=" block w-full mt-1"
    />
    <x-input-error :messages="$errors->get('title')" class="mt-2"/>
</div>
<div>
    <x-input-label for="body" :value="('Body')"/>
    <x-textarea id="body"
                name="body"
                class=" block w-full mt-1"
    >{{old('body', $post->body)}}</x-textarea>
    <x-input-error :messages="$errors->get('body')" class="mt-2"/>
</div>
