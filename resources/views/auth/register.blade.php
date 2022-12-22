@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card" style="max-width:600px;margin:auto">
                <div class="card-header">{{ __('Register') }}</div>

                <div class="card-body">
                    <register-component 
                        action='{{ route('register') }}' />
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
